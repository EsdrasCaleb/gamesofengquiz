import React from 'react';
import { Form, Input, Button, Checkbox, Select, Radio, InputNumber } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const SurveyForm = () => {
    const [form] = Form.useForm();

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

            <Form.Item name="formacao" label="Qual o seu maior nível de formação?" rules={[{ required: true }]}>
                <Select>
                    <Option value="fundamental">Fundamental</Option>
                    <Option value="medio">Médio</Option>
                    <Option value="graduacao">Graduação</Option>
                    <Option value="especializacao">Especialização</Option>
                    <Option value="mestrado">Mestrado</Option>
                    <Option value="doutorado">Doutorado</Option>
                </Select>
            </Form.Item>

            <Form.Item name="area_formacao" label="Qual a sua principal área de formação?" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="anos_experiencia" label="A quantos anos você trabalha com desenvolvimento de jogos?" rules={[{ required: true }]}>
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item name="tamanho_maior_time" label="Incluindo você, quantas pessoas tinham no maior time que você trabalhou desenvolvendo jogos?" rules={[{ required: true }]}>
                <InputNumber min={1} />
            </Form.Item>

            <Form.Item name="qtd_projetos" label="Em quantos projetos (jogos) você já trabalhou? (inclua os que não foram efetivamente lançados)" rules={[{ required: true }]}>
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item name="qtd_lancados" label="Em quantos projetos (jogos) foram lançados?" rules={[{ required: true }]}>
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item name="papel_principal" label="Seu principal papel (o que você mais faz) no desenvolvimento de jogos?" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="ferramentas_desenvolvimento" label="O que você costuma usar para desenvolver jogos?" rules={[{ required: true }]}>
                <Select mode="tags" placeholder="Ex: Unity, Godot, Unreal">
                </Select>
            </Form.Item>

            <Form.Item name="tipos_jogos" label="Quais tipos de jogos você costuma produzir?" rules={[{ required: true }]}>
                <Select mode="tags" />
            </Form.Item>

            <Form.Item name="processos_engenharia" label="Quais Processos de Engenharia de Software você costuma usar?" rules={[{ required: true }]}>
                <Select mode="tags" />
            </Form.Item>

            <Form.Item name="opiniao_praticas" label="O que você acha dessas práticas?" rules={[{ required: true }]}>
                <TextArea rows={3} />
            </Form.Item>

            <Form.Item name="testes" label="Seus testes:" rules={[{ required: true }]}>
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="usa_framework_teste" label="Você usa algum framework para testar os jogos?" rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value="sim">Sim</Radio>
                    <Radio value="nao">Não</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="qual_framework" label="Se sim, diga qual (engine inclusa):">
                <Input />
            </Form.Item>

            <Form.Item name="como_testou" label="O que você já usou para realizar os testes?" rules={[{ required: true }]}>
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="o_que_e_testado" label="O que é testado nos testes automatizados?" rules={[{ required: true }]}>
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="inicio_testes" label="Os testes automatizados começam a ser criados em que etapa?" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="como_faz_teste" label="Para fazer os testes automatizados:" rules={[{ required: true }]}>
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="framework_teste_2" label="Se usa um framework, diga qual (engine inclusa):">
                <Input />
            </Form.Item>

            <Form.Item name="teste_como_requisito" label="Você usa testes passando como requisito para algo?" rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value="sim">Sim</Radio>
                    <Radio value="nao">Não</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="consideracoes_finais" label="Alguma consideração final?">
                <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="contato_entrevista" label="Você quer ser contactado para uma entrevista detalhada?" rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value="sim">Sim</Radio>
                    <Radio value="nao">Não</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="email" label="Seu e-mail? (opcional)">
                <Input type="email" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">Enviar</Button>
            </Form.Item>
        </Form>
    );
};

export default SurveyForm;
