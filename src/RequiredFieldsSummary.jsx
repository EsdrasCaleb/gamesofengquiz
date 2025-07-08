import { Alert, Typography } from 'antd';
import {useTranslation} from "react-i18next";

const { Text } = Typography;

const RequiredFieldsSummary = ({ missingFields = [] }) => {
    const { t } = useTranslation();

    if (!missingFields.length) return null;

    return (
        <Alert
            type="warning"
            message={t('required_fields_missing')}
            description={
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {missingFields.map((fieldName, idx) => (
                        <li key={idx}>
                            <Text strong>
                                {t(fieldName)}
                            </Text>
                        </li>
                    ))}
                </ul>
            }
        />
    );
};

export default RequiredFieldsSummary;
