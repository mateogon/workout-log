import styled from "styled-components";

const defaultTextStyles = (theme) => `
  color: ${theme.colors.text.primary};
  
  font-size: ${theme.fontSizes.body};
`;

const body = (theme) => `
    
    font-size: ${theme.fontSizes.body};
`;

const hint = (theme) => `
    
    font-size: ${theme.fontSizes.body};
`;

const error = (theme) => `
    color: ${theme.colors.text.error};
    font-size: ${theme.fontSizes.label};
`;

const caption = (theme) => `
    
    font-size: ${theme.fontSizes.caption};
`;

const label = (theme) => `
    
    font-size: ${theme.fontSizes.body};
`;

const title = (theme) => `
    
    font-size: ${theme.fontSizes.title};
`;

const variants = {
  body,
  caption,
  error,
  hint,
  label,
  title,
};

export const Text = styled.Text`
  ${({ theme }) => defaultTextStyles(theme)}
  ${({ variant, theme }) => variants[variant](theme)}
`;

Text.defaultProps = {
  variant: "body",
};
