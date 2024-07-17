import React from "react";
import "../Page.css";
import { useTranslation } from "react-i18next";

const Bookmark = () => {
  const { t } = useTranslation();
  return (
    <div className="page">
      <h2 className="pageTitle">{t("welcome to Bookmarks")}</h2>
    </div>
  );
};

export default Bookmark;
