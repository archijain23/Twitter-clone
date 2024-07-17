import React from "react";
import { useTranslation } from "react-i18next";

const PageLoading = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "fles",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h3>{t("Loading...")}</h3>
      </div>
    </div>
  );
};

export default PageLoading;
