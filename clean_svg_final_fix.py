#!/usr/bin/env python3
"""
SVG Cleaning Script - Final Solution

This script cleans anatomical-muscles-detailed.svg by removing unwanted elements
while preserving the detailed head shape (with ears) and all colorful muscles.

Key Innovation:
- Extracts detailed head shapes from clipPath elements BEFORE removing them
- Removes grey oval paths that were being clipped to head shape
- Preserves all colorful muscle anatomy

See SVG_CLEANING_SOLUTION.md for detailed explanation of the solution process.

Input:  public/anatomical-muscles-detailed.svg (3.2MB, 4,386 paths)
Output: public/anatomical-muscles-clean.svg (~500KB, 270 paths)
"""

import xml.etree.ElementTree as ET
import re
from typing import Optional, Tuple

# ===== Constants =====

# Color thresholds
VERY_DARK_THRESHOLD = 5  # RGB average below this = text/dots
GREY_OVAL_MIN_LIGHTNESS = 70  # Lower bound for grey ovals
GREY_OVAL_MAX_LIGHTNESS = 90  # Upper bound for grey ovals
GREY_NEUTRAL_VARIANCE = 5  # Max color variance for neutral grey
TEXT_MIN_LIGHTNESS = 30  # Lower bound for text lightness
TEXT_MAX_LIGHTNESS = 60  # Upper bound for text lightness
TEXT_NEUTRAL_VARIANCE = 10  # Max color variance for text grey

# Grey square specific RGB values
GREY_SQUARE_R_MIN = 72
GREY_SQUARE_R_MAX = 74
GREY_SQUARE_G_MIN = 72
GREY_SQUARE_G_MAX = 74
GREY_SQUARE_B_MIN = 72
GREY_SQUARE_B_MAX = 74
GREY_SQUARE_PATH_START = 'M 591.859375 143.851562'

# Head area bounds (front view)
HEAD_X_MIN = 586
HEAD_X_MAX = 790
HEAD_Y_MIN = 139
HEAD_Y_MAX = 400

# Text area bounds
TEXT_Y_MAX = 250

# Default skin tone color for extracted head shapes
SKIN_TONE_COLOR = 'rgb(99.19%, 88.07%, 69.22%)'

# ===== Pre-compiled Regex Patterns =====
RGB_PATTERN = re.compile(r'rgb\(([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)%\)')
COORDINATE_PATTERN = re.compile(r'M\s+([\d.]+)\s+([\d.]+)')


# ===== Helper Functions =====

def get_tag_name(element: ET.Element) -> str:
    """Extract tag name from element, handling XML namespaces."""
    tag = element.tag
    return tag.split('}')[-1] if '}' in tag else tag


def parse_rgb(rgb_str: str) -> Optional[Tuple[float, float, float]]:
    """Parse RGB color string in format 'rgb(r%, g%, b%)' to tuple of floats."""
    match = RGB_PATTERN.search(rgb_str)
    if match:
        return tuple(float(x) for x in match.groups())
    return None


def is_very_dark(rgb: Optional[Tuple[float, float, float]]) -> bool:
    """Check if RGB color is very dark (text/dots)."""
    if rgb is None:
        return False
    r, g, b = rgb
    return (r + g + b) / 3 < VERY_DARK_THRESHOLD

def is_grey_oval_or_square(rgb: Optional[Tuple[float, float, float]], path_d: str) -> bool:
    """
    Identify grey square and grey oval paths in head area.

    Returns True if the path should be removed (is grey square or grey oval).
    """
    if rgb is None:
        return False

    r, g, b = rgb
    avg = (r + g + b) / 3

    # Remove grey square rectangle (specific RGB values and path start)
    if (GREY_SQUARE_R_MIN <= r <= GREY_SQUARE_R_MAX and
        GREY_SQUARE_G_MIN <= g <= GREY_SQUARE_G_MAX and
        GREY_SQUARE_B_MIN <= b <= GREY_SQUARE_B_MAX):
        if GREY_SQUARE_PATH_START in path_d:
            return True

    # Remove all grey oval paths in head area
    # These are the simple ovals that were being clipped to head shape
    if GREY_OVAL_MIN_LIGHTNESS <= avg <= GREY_OVAL_MAX_LIGHTNESS:
        variance = max(abs(r-g), abs(g-b), abs(r-b))
        if variance < GREY_NEUTRAL_VARIANCE:  # Neutral grey
            # Check if it's an ellipse/circle path in head area
            m_match = COORDINATE_PATTERN.search(path_d)
            if m_match:
                x = float(m_match.group(1))
                y = float(m_match.group(2))
                # Oval paths in front view head area
                if HEAD_X_MIN <= x <= HEAD_X_MAX and HEAD_Y_MIN <= y <= HEAD_Y_MAX:
                    # Only remove if it has C commands (ellipse curves)
                    if 'C' in path_d:
                        return True

    return False


def is_front_back_text(rgb: Optional[Tuple[float, float, float]], path_d: str) -> bool:
    """
    Identify dark grey text paths in upper area (FRONT VIEW / BACK VIEW).

    Returns True if the path should be removed (is text).
    """
    if rgb is None:
        return False

    r, g, b = rgb
    avg = (r + g + b) / 3

    # Medium-dark grey text
    if TEXT_MIN_LIGHTNESS <= avg <= TEXT_MAX_LIGHTNESS:
        variance = max(abs(r-g), abs(g-b), abs(r-b))
        if variance < TEXT_NEUTRAL_VARIANCE:  # Relatively neutral
            m_match = COORDINATE_PATTERN.search(path_d)
            if m_match:
                y = float(m_match.group(2))
                # Text is in upper area
                if y < TEXT_Y_MAX:
                    return True
    return False

def clean_svg(input_file: str, output_file: str) -> bool:
    """
    Clean SVG file by removing unwanted elements while preserving anatomy.

    Args:
        input_file: Path to input SVG file
        output_file: Path to output SVG file

    Returns:
        True if successful, False otherwise
    """
    # Validate input file exists
    try:
        tree = ET.parse(input_file)
    except FileNotFoundError:
        print(f"Error: Input file not found: {input_file}")
        return False
    except ET.ParseError as e:
        print(f"Error: Invalid SVG file: {e}")
        return False

    root = tree.getroot()

    stats = {
        'removed_clipPath': 0,
        'removed_rect': 0,
        'removed_clip_attrs': 0,
        'total_paths': 0,
        'kept_paths': 0,
        'removed_leader_lines': 0,
        'removed_very_dark': 0,
        'removed_grey_square': 0,
        'removed_text_paths': 0,
        'extracted_paths': 0,
    }

    # Extract paths from clipPath definitions before removing them
    # (The detailed head shape is inside clipPath elements!)
    extracted_paths = []
    for parent in root.iter():
        for child in list(parent):
            tag = get_tag_name(child)
            if tag == 'clipPath':
                # Extract all path elements from this clipPath
                for path_elem in child.iter():
                    path_tag = get_tag_name(path_elem)
                    if path_tag == 'path':
                        path_d = path_elem.get('d', '')
                        # Skip simple rectangular clipping boxes (only M and L commands, simple rectangles)
                        # Keep complex paths with curves (C commands) - these are the detailed head shapes
                        if 'C' in path_d:  # Has curves = detailed shape, not a simple box
                            # Clone the path and convert clip-rule to fill-rule
                            new_path = ET.Element(path_elem.tag, path_elem.attrib)
                            if 'clip-rule' in new_path.attrib:
                                new_path.attrib['fill-rule'] = new_path.attrib.pop('clip-rule')
                            # Add a default fill if none exists (skin tone color)
                            if 'fill' not in new_path.attrib:
                                new_path.attrib['fill'] = SKIN_TONE_COLOR
                                new_path.attrib['fill-opacity'] = '1'
                            extracted_paths.append(new_path)
                            stats['extracted_paths'] += 1
                stats['removed_clipPath'] += 1
                parent.remove(child)

    # Add extracted paths to the root defs or directly to root
    for path in extracted_paths:
        root.append(path)

    # Remove clip-path attributes
    for elem in root.iter():
        tag = get_tag_name(elem)
        if tag == 'g' and elem.get('clip-path'):
            del elem.attrib['clip-path']
            stats['removed_clip_attrs'] += 1

    # Process paths
    for parent in root.iter():
        for child in list(parent):
            tag = get_tag_name(child)

            if tag == 'rect':
                stats['removed_rect'] += 1
                parent.remove(child)

            elif tag == 'path':
                stats['total_paths'] += 1
                fill = child.get('fill', '')
                stroke = child.get('stroke', '')
                path_d = child.get('d', '')

                if fill.startswith('url('):
                    stats['kept_paths'] += 1
                    continue

                if stroke and (not fill or fill == 'none'):
                    stats['removed_leader_lines'] += 1
                    parent.remove(child)
                    continue

                if fill and fill != 'none':
                    rgb = parse_rgb(fill)
                    if rgb:
                        # Remove very dark (text/dots)
                        if is_very_dark(rgb):
                            stats['removed_very_dark'] += 1
                            parent.remove(child)
                            continue
                        # Remove grey square AND grey ovals
                        if is_grey_oval_or_square(rgb, path_d):
                            stats['removed_grey_square'] += 1
                            parent.remove(child)
                            continue
                        # Remove FRONT VIEW / BACK VIEW text
                        if is_front_back_text(rgb, path_d):
                            stats['removed_text_paths'] += 1
                            parent.remove(child)
                            continue

                stats['kept_paths'] += 1

    # Write output file with error handling
    try:
        tree.write(output_file, encoding='utf-8', xml_declaration=True)
    except (PermissionError, IOError) as e:
        print(f"Error: Cannot write output file: {e}")
        return False

    # Print statistics
    print(f"\n=== Final SVG Cleaning Complete ===")
    print(f"\nRemoved:")
    print(f"  - Background rectangle: {stats['removed_rect']}")
    print(f"  - ClipPath definitions: {stats['removed_clipPath']}")
    print(f"  - Clip-path attributes: {stats['removed_clip_attrs']}")
    print(f"  - Leader lines: {stats['removed_leader_lines']}")
    print(f"  - Very dark (dots): {stats['removed_very_dark']}")
    print(f"  - Grey square + grey ovals: {stats['removed_grey_square']}")
    print(f"  - FRONT VIEW / BACK VIEW text: {stats['removed_text_paths']}")
    print(f"\nKept:")
    print(f"  - All other paths (body/muscles/hands/feet/head): {stats['kept_paths']} (from {stats['total_paths']})")
    print(f"  - Extracted detailed head shapes from clipPath: {stats['extracted_paths']}")
    print(f"\nOutput: {output_file}")

    return True


if __name__ == '__main__':
    success = clean_svg(
        'public/anatomical-muscles-detailed.svg',
        'public/anatomical-muscles-clean.svg'
    )
    exit(0 if success else 1)
