/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { CsrfProvider } from './context/CsrfContext';

function Root() {
    return (
      <CsrfProvider>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </CsrfProvider>
    );
  }

AppRegistry.registerComponent(appName, () => Root);
