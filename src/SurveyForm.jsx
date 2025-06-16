import React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { Form, Input, Button, Checkbox, Select, Radio, InputNumber } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const SurveyForm = () => {
    const [form] = Form.useForm();

    const { t } = useTranslation();

    const idUnico = uuidv4();

    const onFinish = (values) => {
        console.log('Respostas:', values);
        // Aqui você envia para seu endpoint Google Apps Script
        // fetch('https://script.google.com/macros/s/SEU_ID/exec', {
        //   method: 'POST',
        //   body: JSON.stringify(values),
        // });
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="termo" valuePropName="checked" rules={[{ required: true, message: 'Aceite o termo' }]}>
                <Checkbox>
                    Declaro, por meio deste termo, que concordei em participar na pesquisa intitulada "<strong>Práticas de Engenharia de Software no Desenvolvimento de Jogos Digitais</strong>", etc...
                </Checkbox>
            </Form.Item>

            <Form.Item name="formacao" label={t('formacao')} rules={[{ required: true }]}>
                <Select>
                    <Option value="fundamental">{t('formacao_opcoes.fundamental')}</Option>
                    <Option value="medio">{t('formacao_opcoes.medio')}</Option>
                    <Option value="graduacao">{t('formacao_opcoes.graduacao')}</Option>
                    <Option value="especializacao">{t('formacao_opcoes.especializacao')}</Option>
                    <Option value="mestrado">{t('formacao_opcoes.mestrado')}</Option>
                    <Option value="doutorado">{t('formacao_opcoes.doutorado')}</Option>
                </Select>
            </Form.Item>

            <Form.Item name="where_from" label="{t('ufrom')}" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="area_formacao" label={t('area_formacao')} rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="anos_experiencia" label={t('anos_experiencia')} rules={[{ required: true }]}>
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item name="tamanho_maior_time" label={t('tamanho_maior_time')} rules={[{ required: true }]}>
                <InputNumber min={1} />
            </Form.Item>

            <Form.Item name="qtd_projetos" label={t('qtd_projetos')} rules={[{ required: true }]}>
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item name="qtd_lancados" label={t('qtd_lancados')} rules={[{ required: true }]}>
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item name="papel_principal" label={t('papel_principal')} rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="ferramentas_desenvolvimento" label={t('ferramentas_desenvolvimento')} rules={[{ required: true }]}>
                <Select mode="tags" placeholder={t('placeholder_ferramentas')}>
                </Select>
            </Form.Item>

            <Form.Item name="tipos_jogos" label={t('tipos_jogos')} rules={[{ required: true }]}>
                <Select mode="tags" />
            </Form.Item>

            <Form.Item name="processos_engenharia" label={t('processos_engenharia')} rules={[{ required: true }]}>
                <Select mode="tags" />
            </Form.Item>

            <Form.Item name="opiniao_praticas" label={t('opiniao_praticas')} rules={[{ required: true }]}>
                <TextArea rows={3} />
            </Form.Item>

            <Form.Item name="testes" label={t('testes')} rules={[{ required: true }]}>
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="usa_framework_teste" label={t('usa_framework_teste')} rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value="sim">{t('sim')}</Radio>
                    <Radio value="nao">{t('nao')}</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="qual_framework" label={t('qual_framework')}>
                <Input />
            </Form.Item>

            <Form.Item name="como_testou" label={t('como_testou')} rules={[{ required: true }]}>
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="o_que_e_testado" label={t('o_que_e_testado')} rules={[{ required: true }]}>
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="inicio_testes" label={t('inicio_testes')} rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="como_faz_teste" label={t('como_faz_teste')} rules={[{ required: true }]}>
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="framework_teste_2" label={t('framework_teste_2')}>
                <Input />
            </Form.Item>

            <Form.Item name="teste_como_requisito" label={t('teste_como_requisito')} rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value="sim">{t('sim')}</Radio>
                    <Radio value="nao">{t('nao')}</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="consideracoes_finais" label={t('consideracoes_finais')}>
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="contato_entrevista" label={t('contato_entrevista')} rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value="sim">{t('sim')}</Radio>
                    <Radio value="nao">{t('nao')}</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="email" label={t('email')}>
                <Input type="email" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">{t('enviar')}</Button>
            </Form.Item>
        </Form>
    );
};

export default SurveyForm;
