import React, {useEffect} from "react";
import {Select, Checkbox, Flex, Typography} from "antd";
import {useTranslation} from "react-i18next";

const { Option } = Select;

const LanguageSwitcher = ({ i18n, data, setData }) => {
    const { t } = useTranslation();

    const stable = ["en", "es","pt-BR"];
    const experimental = {
        fr: "Français (auto-traduit)",
        it: "Italiano (tradotto automaticamente)",
        zh: "普通话（自动翻译）",
        ja: "日本語（自動翻訳）",
        ko: "한국어 (자동 번역)"
    };

    const candidates = i18n.languages || [];

    const safeLang =
        candidates.find(l => stable.includes(l)) ||
        candidates.find(l => Object.keys(experimental).includes(l)) ||
        "en";

    useEffect(() => {
        setData({
            ...data,
            "form_language": stable.includes(safeLang)?safeLang:safeLang+' translated',
        });
    }, []);

    const handleLanguageChange = (value) => {
        i18n.changeLanguage(value);
        setData({
            ...data,
            "form_language": stable.includes(value)?value:value+' translated',
        });
    };

    const handleCheckboxChange = (field) => (e) => {
        setData({
            ...data,
            [field]: e.target.checked,
        });
    };

    return (
        <Flex className="flex" gap="middle" justify="center" orientation="horizontal">
            <Typography.Text strong={5} >Survey on Quality in Game Development</Typography.Text>
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
