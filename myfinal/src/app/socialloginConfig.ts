import { AuthServiceConfig,GoogleLoginProvider,FacebookLoginProvider,LinkedinLoginProvider } from "angular-6-social-login";
// Configs 
export function getAuthServiceConfigs() {
    let config = new AuthServiceConfig(
        [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("Your-Facebook-app-id")
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("357040066517-aaglkn83u08lk1pneq767j218j37a467.apps.googleusercontent.com")
          },
            {
              id: LinkedinLoginProvider.PROVIDER_ID,
              provider: new LinkedinLoginProvider("1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com")
            },
        ]
    );
    return config;
  }