export const MAP_DIRECT_URL = 'https://impactra-civicpulse-new.ai.studio/';

/**
 * Opens the direct interactive map link in the same tab.
 */
export const openMapDirectLink = (e?: React.MouseEvent) => {
  if (e) {
    e.preventDefault();
  }
  window.location.href = MAP_DIRECT_URL;
};
