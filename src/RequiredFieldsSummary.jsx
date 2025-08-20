import { Alert, Typography } from 'antd';
import {useTranslation} from "react-i18next";

const { Text } = Typography;

const RequiredFieldsSummary = ({ missingFields = [] }) => {
    const { t } = useTranslation();

    if (!missingFields.length) return null;

    return (
        <Alert
            type="warning"
            message={t('survey.required_fields_missing')}
            description={
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {missingFields.map((fieldName, idx) => {
                        let label;
                        if (fieldName.endsWith("_outro")) {
                            const baseName = fieldName.replace(/_outro$/, "");
                            label = `${t("survey." + baseName)} - ${t("survey.common.outro")}`;
                        } else {
                            label = t("survey." + fieldName);
                        }

                        return (
                            <li key={idx}>
                                <Text strong>{label}</Text>
                            </li>
                        );
                    })}
                </ul>
            }
        />
    );
};

export default RequiredFieldsSummary;
