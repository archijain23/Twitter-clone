import React from "react";
import "../Page.css";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const { t } = useTranslation();
  return (
    <div className="page">
      <h2 className="pageTitle">{t("welcome to Notifications")}</h2>
    </div>
  );
};

export default Notifications;
