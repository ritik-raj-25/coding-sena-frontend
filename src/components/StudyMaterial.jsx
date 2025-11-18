import React, { useState } from "react";
import { IoLogoYoutube } from "react-icons/io5";
import { FaRegFilePdf, FaDownload} from "react-icons/fa";
import { CiLink } from "react-icons/ci";
import Modal from "./Modal";

function StudyMaterial({ title, materialType, url }) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const getEmbeddablePdfUrl = (originalUrl) => {
    // only google drive link
    if (originalUrl.includes("drive.google.com")) {
      const fileIdMatch = originalUrl.match(/\/d\/([^/]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    return originalUrl;
  };

  const getEmbeddableYoutubeUrl = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (urlObj.hostname.includes("youtube.com")) {
      if (urlObj.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${urlObj.pathname.split("/")[2]}?autoplay=1&rel=0&modestbranding=1`;
      }
      else {
        return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}?autoplay=1&rel=0&modestbranding=1`;
      }
    }
    return url;
  };

  const handleClick = () => {
    switch (materialType) {
      case "PDF":
        setIsIframeLoading(true);
        setShowPdfModal(true);
        break;
      case "VIDEO":
        setIsIframeLoading(true);
        setShowVideoModal(true);
        break;
      case "LINK":
        window.open(url, "_blank", "noopener,noreferrer");
        break;
      default:
        break;
    }
  };

  const renderIcon = () => {
    switch (materialType) {
      case "VIDEO":
        return <IoLogoYoutube className="w-6 h-6 text-red-600 flex-shrink-0" />;
      case "PDF":
        return <FaRegFilePdf className="w-5 h-5 text-red-700 flex-shrink-0" />;
      case "LINK":
        return <CiLink className="w-6 h-6 text-blue-600 flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition-all duration-200"
      >
        {renderIcon()}
        <h3 className="text-md font-medium text-gray-700">{title}</h3>
      </div>

      <Modal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        title={title}
      >
        {isIframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <iframe
          src={getEmbeddableYoutubeUrl(url)}
          className={`w-full h-full border-none ${isIframeLoading ? "invisible" : "visible"}`}
          onLoad={() => setIsIframeLoading(false)}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </Modal>

      <Modal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        title={title}
        actions={
          <a
            href={url}
            download
            target="_blank"
            title="Download File"
            className="hover:text-indigo-400 transition-colors"
          >
            <FaDownload />
          </a>
        }
      >
        {isIframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <iframe
          src={getEmbeddablePdfUrl(url)}
          className={`w-full h-full border-none ${
            isIframeLoading ? "invisible" : "visible"
          }`}
          title={title}
          onLoad={() => setIsIframeLoading(false)}
        />
      </Modal>
    </>
  );
}

export default StudyMaterial;