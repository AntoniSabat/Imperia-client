import {environment} from "../environments/environment";

export function checkImageUrl(url: string) {
  if (!url) return false;
  else {
    const pattern = new RegExp('^https?:\\/\\/.+\\.(png|jpg|jpeg|bmg|gif|webp)$', 'i');
    return pattern.test(url);
  }
}

export function formatImageUrl(url: string) {
  return `${environment.apiBaseUrl}/files/${url}`
}
