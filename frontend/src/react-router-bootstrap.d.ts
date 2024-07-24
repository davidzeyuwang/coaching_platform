declare module 'react-router-bootstrap' {
    import { ComponentType, ReactNode } from 'react';
    import { LinkProps } from 'react-router-dom';
    import { BsPrefixComponent } from 'react-bootstrap/helpers';
  
    export interface LinkContainerProps extends LinkProps {
      children: ReactNode;
    }
  
    export const LinkContainer: ComponentType<LinkContainerProps>;
  }