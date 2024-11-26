import { DefaultStack } from '../navigation/stack-handler';
import { MenuContextProvider, FavorContextProvider, AuthenticationContextProvider } from '../context/menu-provider';

export const Main = () => {
  return (
    <>  
    <MenuContextProvider>
      <FavorContextProvider>
        <AuthenticationContextProvider>
          <DefaultStack />
        </AuthenticationContextProvider>
    </FavorContextProvider>
    </MenuContextProvider>    
    </>
  );
};
