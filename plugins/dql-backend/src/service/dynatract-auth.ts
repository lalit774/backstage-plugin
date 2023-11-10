import { dtFetch } from '../utils';

export type DynatraceSsoConfig = {
  clientId: string;
  clientSecret: string;
  accountUrn: string;
  tokenUrl: string;
};

export type TokenResponse = {
  scope: string;
  token_type: string;
  expires_in: number;
  access_token: string;
  resource: string;
};

export const getAccessToken = async (
  config: DynatraceSsoConfig,
): Promise<TokenResponse> => {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    resource: config.accountUrn,
  });
  const tokenRes = await dtFetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  return await tokenRes.json();
};
