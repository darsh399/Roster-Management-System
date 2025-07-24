import providersData from '../providers.json';

export const LOAD_PROVIDERS = "LOAD_PROVIDERS";

export const loadProviders = () => (dispatch) => {
  try {
    dispatch({ type: LOAD_PROVIDERS, payload: providersData });
  } catch (err) {
    console.error("Failed to load proviiders:", err);
  }
};