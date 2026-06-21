import { useEffect } from "react";

export default function SEO({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title;
      
      // Update og:title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute("content", title);

      // Update twitter:title
      let twTitle = document.querySelector('meta[name="twitter:title"]');
      if (!twTitle) {
        twTitle = document.createElement("meta");
        twTitle.setAttribute("name", "twitter:title");
        document.head.appendChild(twTitle);
      }
      twTitle.setAttribute("content", title);
    }
    
    if (description) {
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);

      // Update og:description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);

      // Update twitter:description
      let twDesc = document.querySelector('meta[name="twitter:description"]');
      if (!twDesc) {
        twDesc = document.createElement("meta");
        twDesc.setAttribute("name", "twitter:description");
        document.head.appendChild(twDesc);
      }
      twDesc.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}
