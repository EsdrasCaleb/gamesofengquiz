import React from "react";
import { Select, Checkbox, Flex } from "antd";
import {useTranslation} from "react-i18next";

const { Option } = Select;

const LanguageSwitcher = ({ i18n, data, setData }) => {
    const { t } = useTranslation();

    const stable = ["en", "es","pt-BR"];
    const experimental = {
        fr: "Français (expérimental)",
        it: "Italiano (sperimentale)",
        zh: "普通话（实验性）",
        ja: "日本語（試験的）",
        ko: "한국어(시험용)"
    };

    const candidates = i18n.languages || [];

    const safeLang =
        candidates.find(l => stable.includes(l)) ||
        candidates.find(l => Object.keys(experimental).includes(l)) ||
        "en";


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
                defaultValue={safeLang}
                style={{ width: 120 }}
                onChange={handleLanguageChange}
            >
                <Option value="en">English</Option>
                <Option value="pt-BR">Português</Option>
                <Option value="es">Español</Option>

                {experimental[safeLang] && (
                    <Option value={safeLang}>{experimental[safeLang]}</Option>
                )}
            </Select>
            <Checkbox
                checked={data?.shareBrowser || false}
                onChange={handleCheckboxChange("shareBrowser")}
            >
                {t("switcher.share_browser_language")}
            </Checkbox>
        </Flex>
    );
};

export default LanguageSwitcher;
