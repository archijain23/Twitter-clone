import React from "react";
import "../Page.css";
import { useTranslation } from "react-i18next";

const Explore = () => {
  const { t } = useTranslation();
  return (
    <div className="page">
      <h2 className="pageTitle">{t("welcome to Explore")}</h2>
    </div>
  );
};

export default Explore;
