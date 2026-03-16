import { StyledImage } from '../StyledImage';
import { StyledLink } from '../StyledLink';
import logo from '../../../assets/icons/new-app-logo.svg';
import whiteLogo from '../../../assets/icons/new-app-footer-logo.svg';
import blackLogo from '../../../assets/icons/new-black-icon.svg';

export function AppLogo() {
  return (
    <StyledLink href="/">
      <StyledImage src={logo} alt="logo" width={200} height={50} />
    </StyledLink>
  );
}

export function WhiteAppLogo() {
  return (
    <StyledLink href="/">
      <StyledImage src={whiteLogo} alt="logo" width={200} height={50} />
    </StyledLink>
  );
}

export function BlackAppLogo() {
  return (
    <StyledLink href="/">
      <StyledImage src={blackLogo} alt="logo" width={200} height={50} />
    </StyledLink>
  );
}
