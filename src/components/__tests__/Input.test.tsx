import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
    describe('rendering', () => {
        it('should render input element', () => {
            render(<Input placeholder="Enter text" />);
            expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
        });

        it('should render with label when provided', () => {
            render(<Input label="Email" />);
            expect(screen.getByText('Email')).toBeInTheDocument();
        });

        it('should not render label when not provided', () => {
            render(<Input placeholder="test" />);
            expect(screen.queryByRole('label')).not.toBeInTheDocument();
        });

        it('should render error message when provided', () => {
            render(<Input error="This field is required" />);
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });

        it('should not render error message when not provided', () => {
            render(<Input />);
            expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
        });
    });

    describe('styling', () => {
        it('should have default background style', () => {
            render(<Input data-testid="input" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveStyle({ background: 'rgba(30, 27, 50, 0.8)' });
        });

        it('should have default border style', () => {
            render(<Input data-testid="input" />);
            const input = screen.getByTestId('input');
            expect(input.style.border).toContain('1px solid');
        });

        it('should have white text color by default', () => {
            render(<Input data-testid="input" />);
            const input = screen.getByTestId('input');
            // Browser converts 'white' to 'rgb(255, 255, 255)'
            expect(input).toHaveStyle({ color: 'rgb(255, 255, 255)' });
        });

        it('should merge custom styles with defaults', () => {
            render(
                <Input
                    data-testid="input"
                    style={{ height: '50px', padding: '10px' }}
                />
            );
            const input = screen.getByTestId('input');

            // Custom styles should be applied
            expect(input).toHaveStyle({ height: '50px' });
            expect(input).toHaveStyle({ padding: '10px' });

            // Default styles should still be present
            expect(input).toHaveStyle({ color: 'rgb(255, 255, 255)' });
            expect(input).toHaveStyle({ background: 'rgba(30, 27, 50, 0.8)' });
        });

        it('should allow custom styles to override defaults', () => {
            render(
                <Input
                    data-testid="input"
                    style={{ background: 'red', color: 'blue' }}
                />
            );
            const input = screen.getByTestId('input');

            // Custom styles should override defaults
            // Browser converts 'red' to 'red' but 'blue' to 'rgb(0, 0, 255)'
            expect(input).toHaveStyle({ background: 'red' });
            expect(input).toHaveStyle({ color: 'rgb(0, 0, 255)' });
        });

        it('should apply error styling when error is present', () => {
            render(<Input data-testid="input" error="Error!" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveClass('border-red-500/50');
        });

        it('should apply custom className', () => {
            render(<Input data-testid="input" className="custom-class" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveClass('custom-class');
        });

        it('should have proper focus ring class', () => {
            render(<Input data-testid="input" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveClass('focus-visible:ring-2');
            expect(input).toHaveClass('focus-visible:ring-purple-500');
        });

        it('should have disabled styles when disabled', () => {
            render(<Input data-testid="input" disabled />);
            const input = screen.getByTestId('input');
            expect(input).toHaveClass('disabled:cursor-not-allowed');
            expect(input).toHaveClass('disabled:opacity-50');
            expect(input).toBeDisabled();
        });
    });

    describe('interactions', () => {
        it('should accept user input', async () => {
            const user = userEvent.setup();
            render(<Input data-testid="input" />);
            const input = screen.getByTestId('input');

            await user.type(input, 'Hello World');
            expect(input).toHaveValue('Hello World');
        });

        it('should call onChange when value changes', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<Input data-testid="input" onChange={handleChange} />);
            const input = screen.getByTestId('input');

            await user.type(input, 'test');
            expect(handleChange).toHaveBeenCalled();
        });

        it('should call onFocus when focused', async () => {
            const user = userEvent.setup();
            const handleFocus = vi.fn();
            render(<Input data-testid="input" onFocus={handleFocus} />);
            const input = screen.getByTestId('input');

            await user.click(input);
            expect(handleFocus).toHaveBeenCalled();
        });

        it('should call onBlur when blurred', async () => {
            const user = userEvent.setup();
            const handleBlur = vi.fn();
            render(<Input data-testid="input" onBlur={handleBlur} />);
            const input = screen.getByTestId('input');

            await user.click(input);
            await user.tab();
            expect(handleBlur).toHaveBeenCalled();
        });

        it('should not accept input when disabled', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<Input data-testid="input" disabled onChange={handleChange} />);
            const input = screen.getByTestId('input');

            await user.type(input, 'test');
            expect(handleChange).not.toHaveBeenCalled();
            expect(input).toHaveValue('');
        });
    });

    describe('props forwarding', () => {
        it('should forward type prop', () => {
            render(<Input data-testid="input" type="email" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveAttribute('type', 'email');
        });

        it('should forward placeholder prop', () => {
            render(<Input placeholder="Enter your email" />);
            expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        });

        it('should forward value prop', () => {
            render(<Input data-testid="input" value="preset value" readOnly />);
            const input = screen.getByTestId('input');
            expect(input).toHaveValue('preset value');
        });

        it('should forward name prop', () => {
            render(<Input data-testid="input" name="email" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveAttribute('name', 'email');
        });

        it('should forward required prop', () => {
            render(<Input data-testid="input" required />);
            const input = screen.getByTestId('input');
            expect(input).toBeRequired();
        });

        it('should forward min and max props for number inputs', () => {
            render(<Input data-testid="input" type="number" min={0} max={100} />);
            const input = screen.getByTestId('input');
            expect(input).toHaveAttribute('min', '0');
            expect(input).toHaveAttribute('max', '100');
        });

        it('should forward maxLength prop', () => {
            render(<Input data-testid="input" maxLength={50} />);
            const input = screen.getByTestId('input');
            expect(input).toHaveAttribute('maxLength', '50');
        });

        it('should forward autoComplete prop', () => {
            render(<Input data-testid="input" autoComplete="email" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveAttribute('autoComplete', 'email');
        });

        it('should forward ref', () => {
            const ref = { current: null as HTMLInputElement | null };
            render(<Input ref={ref} />);
            expect(ref.current).toBeInstanceOf(HTMLInputElement);
        });
    });

    describe('accessibility', () => {
        it('should associate label with input', () => {
            render(<Input label="Username" data-testid="input" />);
            // Label should be visible and input should be accessible
            expect(screen.getByText('Username')).toBeInTheDocument();
        });

        it('should support aria-label', () => {
            render(<Input aria-label="Search" data-testid="input" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveAttribute('aria-label', 'Search');
        });

        it('should support aria-describedby', () => {
            render(
                <>
                    <Input aria-describedby="help-text" data-testid="input" />
                    <span id="help-text">Help text here</span>
                </>
            );
            const input = screen.getByTestId('input');
            expect(input).toHaveAttribute('aria-describedby', 'help-text');
        });

        it('should support aria-invalid when error is present', () => {
            render(<Input data-testid="input" error="Invalid input" aria-invalid="true" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveAttribute('aria-invalid', 'true');
        });
    });

    describe('text visibility (critical fix)', () => {
        it('should have visible text with white color', () => {
            render(<Input data-testid="input" />);
            const input = screen.getByTestId('input');

            // Text should be white for visibility on dark background
            expect(input).toHaveStyle({ color: 'rgb(255, 255, 255)' });
        });

        it('should maintain white text when custom background is set', () => {
            render(
                <Input
                    data-testid="input"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                />
            );
            const input = screen.getByTestId('input');

            // Even with custom background, text should remain white unless explicitly overridden
            expect(input).toHaveStyle({ color: 'rgb(255, 255, 255)' });
        });

        it('should have text-white class applied', () => {
            render(<Input data-testid="input" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveClass('text-white');
        });

        it('should have proper placeholder styling', () => {
            render(<Input data-testid="input" placeholder="Enter text" />);
            const input = screen.getByTestId('input');
            expect(input).toHaveClass('placeholder:text-zinc-500');
        });
    });
});
