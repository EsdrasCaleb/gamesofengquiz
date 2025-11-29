import React from "react";
import { Select, Checkbox, Flex } from "antd";
import {useTranslation} from "react-i18next";

const { Option } = Select;

const LanguageSwitcher = ({ i18n, data, setData }) => {
    const { t } = useTranslation();
    const handleLanguageChange = (value) => {
        i18n.changeLanguage(value);
    };

    const handleCheckboxChange = (field) => (e) => {
        setData({
            ...data,
            [field]: e.target.checked,
        });
    };

    return (
        <Flex className="flex" gap="middle" justify="center" orientation="horizontal">
            <Select
                defaultValue={i18n.language}
                style={{ width: 120 }}
                onChange={handleLanguageChange}
            >
                <Option value="en">English</Option>
                <Option value="pt-BR">Português</Option>
                <Option value="es">Español</Option>
            </Select>
            <Checkbox
                checked={data?.shareBrowser || false}
                onChange={handleCheckboxChange("shareBrowser")}
            >
                {t("switcher.share_browser_language")}
            </Checkbox>

            <Checkbox
                checked={data?.shareSurvey || false}
                onChange={handleCheckboxChange("shareSurvey")}
            >
                {t("switcher.share_survey_language")}
            </Checkbox>
        </Flex>
    );
};

export default LanguageSwitcher;
