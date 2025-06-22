import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Checkbox, Select, Radio, InputNumber } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const setOtherSelected = () =>null;
const handleChange = () =>null
const onChange = () =>null

const SurveyForm = ({ data, uiid, onAnswer }) => {
    const [form] = Form.useForm();

    const { t } = useTranslation();

    const [selecteds, setSelecteds] = useState({});


    //TODO mudar
    const autoSelectred = true;
    const otherSelected = true
    const frameSelected = true;

    const onFinish = async (values) => {
        console.log('Respostas:', values);

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbyOT3aRqac-aTy2Huzno439QHC0nZf_Svf--3TuTQRZn15OJ8n1NO0KEoKj3vU87xVX/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            });

            const result = await response.json();

            if (result.result === 'success') {
            onAnswer(values); // Chama a função de callback passando os dados
            } else {
            console.error('Erro na resposta do servidor:', result.message);
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error.message);
        }
    };




    return (
        <Form
            onValuesChange={(changed, all) => {
                setSelecteds(all);
            }}
            form={form} layout="vertical" onFinish={onFinish}
        >
            <Form.Item name="formacao" label={t('formacao')} rules={[{ required: true, message: t('formacao_required') }]}>
               <Radio.Group>
                <Radio value="nenhum">{t('formacao_opcoes.none')}</Radio>
                <Radio value="fundamental">{t('formacao_opcoes.fundamental')}</Radio>
                <Radio value="medio">{t('formacao_opcoes.medio')}</Radio>
                <Radio value="graduacao">{t('formacao_opcoes.graduacao')}</Radio>
                <Radio value="especializacao">{t('formacao_opcoes.especializacao')}</Radio>
                <Radio value="mestrado">{t('formacao_opcoes.mestrado')}</Radio>
                <Radio value="doutorado">{t('formacao_opcoes.doutorado')}</Radio>
            </Radio.Group>
            </Form.Item>

            <Form.Item name="where_from" label={t('ufrom')} >
                <Input />
            </Form.Item>
            <Form.Item name="how_old" label={t('howold')} >
                <Input />
            </Form.Item>

            <Form.Item
                name="area_formacao"
                label={t('area_formacao')}
                rules={[{ required: true, message: t('area_formacao_required') }]}
            >
                <Radio.Group>
                    <Radio value="jogos_digitais">{t('area_formacao_jogos_digitais')}</Radio>
                    <Radio value="computacao">{t('area_formacao_computacao')}</Radio>
                    <Radio value="artes_visuais">{t('area_formacao_artes_visuais')}</Radio>
                    <Radio value="design_grafico">{t('area_formacao_design_grafico')}</Radio>
                    <Radio value="outro">{t('area_formacao_outro')}</Radio>
                </Radio.Group>
            </Form.Item>

            {selecteds['area_formacao']=='outro' && (
                <Form.Item
                name="area_formacao_outro"
                label={t('area_formacao_outro_descreva')}
                rules={[{ required: true, message: t('area_formacao_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

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

            <Form.Item
                name="papel_principal"
                label={t('papel_principal')}
                rules={[{ required: true, message: t('papel_principal_required') }]}
            >
                <Radio.Group>
                <Radio value="programador">{t('papel_programador')}</Radio>
                <Radio value="artista">{t('papel_artista')}</Radio>
                <Radio value="game_designer">{t('papel_game_designer')}</Radio>
                <Radio value="level_designer">{t('papel_level_designer')}</Radio>
                <Radio value="qa">{t('papel_qa')}</Radio>
                <Radio value="artista_som">{t('papel_artista_som')}</Radio>
                <Radio value="outro">{t('papel_outro')}</Radio>
                </Radio.Group>
            </Form.Item>

            {selecteds['papel_principal']=='outro' && (
                <Form.Item
                name="papel_principal_outro"
                label={t('papel_outro_descreva')}
                rules={[{ required: true, message: t('papel_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            <Form.Item
                name="ferramentas_desenvolvimento"
                label={t('ferramentas_desenvolvimento')}
                rules={[{ required: true, message: t('ferramentas_desenvolvimento_required') }]}
            >
                  <Checkbox.Group options={[
                    { value: 'unity', label: t('ferramentas_options.unity') },
                    { value: 'unreal', label: t('ferramentas_options.unreal') },
                    { value: 'godot', label: t('ferramentas_options.godot') },
                    { value: 'gamemaker', label: t('ferramentas_options.gamemaker') },
                    { value: 'rpgmaker', label: t('ferramentas_options.rpgmaker') },
                    { value: 'framework_baixo_nivel', label: t('ferramentas_options.framework_baixo_nivel') },
                    { value: 'outro', label: t('ferramentas_options.outro') }
                ].map(opt => ({ label: opt.label, value: opt.value }))} />
            </Form.Item>

            {otherSelected && (
                <Form.Item
                name="ferramentas_outro_descricao"
                label={t('ferramentas_outro_descricao')}
                rules={[{ required: true, message: t('ferramentas_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            

            <Form.Item
                name="tipos_jogos"
                label={t('tipos_jogos')}
                rules={[{ required: true, message: t('tipos_jogos_required') }]}
            >
                <Checkbox.Group options={[
                    { label: t('tipos_jogos_options.fps'), value: 'fps' },
                    { label: t('tipos_jogos_options.educacional'), value: 'educacional' },
                    { label: t('tipos_jogos_options.rpg'), value: 'rpg' },
                    { label: t('tipos_jogos_options.aventura_narrativa'), value: 'aventura_narrativa' },
                    { label: t('tipos_jogos_options.2d'), value: '2d' },
                    { label: t('tipos_jogos_options.3d'), value: '3d' },
                    { label: t('tipos_jogos_options.plataforma'), value: 'plataforma' },
                    { label: t('tipos_jogos_options.boardgame'), value: 'boardgame' },
                    { label: t('tipos_jogos_options.puzzle'), value: 'puzzle' },
                    { label: t('tipos_jogos_options.simulacao'), value: 'simulacao' },
                    { label: t('tipos_jogos_options.manager'), value: 'manager' },
                    { label: t('tipos_jogos_options.outro'), value: 'outro' },
                ]} onChange={onChange} />
            </Form.Item>

            {otherSelected && (
                <Form.Item
                name="tipos_jogos_outro_descricao"
                label={t('tipos_jogos_outro_descricao')}
                rules={[{ required: true, message: t('tipos_jogos_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            <Form.Item
                name="processos_engenharia"
                label={t('processos_engenharia')}
                rules={[{ required: true, message: t('processos_engenharia_required') }]}
            >
                  <Checkbox.Group options={[
                    { label: t('processos_options.controle_versao'), value: 'controle_versao' },
                    { label: t('processos_options.padroes_design'), value: 'padroes_design' },
                    { label: t('processos_options.modelagem_projeto'), value: 'modelagem_projeto' },
                    { label: t('processos_options.prototipacao'), value: 'prototipacao' },
                    { label: t('processos_options.tdd'), value: 'tdd' },
                    { label: t('processos_options.outro'), value: 'outro' },
                ].map(opt => ({ label: opt.label, value: opt.value }))} />
            </Form.Item>

            {otherSelected && (
                <Form.Item
                name="processos_outro_descricao"
                label={t('processos_outro_descricao')}
                rules={[{ required: true, message: t('processos_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            <Form.Item name="opiniao_praticas" label={t('opiniao_praticas')} rules={[{ required: true }]}>
                <TextArea rows={3} />
            </Form.Item>

            <Form.Item
                name="testes"
                label={t('testes')}
                rules={[{ required: true, message: t('testes_required') }]}
            >
                <Checkbox.Group options={[
                    { value: 'exploratorio', label: t('testes_options.exploratorio') },
                    { value: 'roteiro_qa', label: t('testes_options.roteiro_qa') },
                    { value: 'feedback_massivo', label: t('testes_options.feedback_massivo') },
                    { value: 'outro', label: t('testes_options.outro') }
                ]} />
            </Form.Item>
            );

             {otherSelected && (
                <Form.Item
                name="testes_outro"
                label={t('testes_outro_descricao')}
                rules={[{ required: true, message: t('testes_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            <Form.Item
                name="usa_framework_teste"
                label={t('usa_framework_teste')}
                rules={[{ required: true, message: t('usa_framework_teste_required') }]}
            >
                <Radio.Group onChange={onChange}>
                {[
                    { value: 'engine', label: t('usa_framework_teste_options.engine') },
                    { value: 'framework_aparte', label: t('usa_framework_teste_options.framework_aparte') },
                    { value: 'manual_console', label: t('usa_framework_teste_options.manual_console') },
                    { value: 'outro', label: t('usa_framework_teste_options.outro') }
                ].map((opt) => (
                    <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                    </Radio>
                ))}
                </Radio.Group>
            </Form.Item>

            {otherSelected && (
                <Form.Item
                name="usa_framework_teste_outro"
                label={t('usa_framework_teste_outro_descricao')}
                rules={[{ required: true, message: t('usa_framework_teste_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}
            {frameSelected && (
                <Form.Item name="qual_framework" label={t('qual_framework')}>
                    <Input />
                </Form.Item>
            )}

             <Form.Item
                name="como_testou"
                label={t('como_testou')}
                rules={[{ required: true, message: t('como_testou_required') }]}
            >
                <Checkbox.Group options={[
                    { value: 'somente_jogo', label: t('como_testou_options.somente_jogo') },
                    { value: 'assistentes_debug', label: t('como_testou_options.assistentes_debug') },
                    { value: 'automatizados', label: t('como_testou_options.automatizados') },
                    { value: 'outro', label: t('como_testou_options.outro') }
                ]} onChange={onChange} />
            </Form.Item>

            {otherSelected && (
                <Form.Item
                name="como_testou_outro"
                label={t('como_testou_outro_descricao')}
                rules={[{ required: true, message: t('como_testou_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}
            {autoSelectred &&(
            <>
                <Form.Item
                    name="o_que_e_testado"
                    label={t('o_que_e_testado')}
                    rules={[{ required: true, message: t('o_que_e_testado_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'componentes', label: t('o_que_e_testado_options.componentes') },
                        { value: 'cenarios', label: t('o_que_e_testado_options.cenarios') },
                        { value: 'acoes_personagem', label: t('o_que_e_testado_options.acoes_personagem') },
                        { value: 'teste_fumaca', label: t('o_que_e_testado_options.teste_fumaca') },
                        { value: 'outro', label: t('o_que_e_testado_options.outro') }
                    ]} onChange={onChange} />
                </Form.Item>

                {otherSelected && (
                    <Form.Item
                    name="o_que_e_testado_outro"
                    label={t('o_que_e_testado_outro_descricao')}
                    rules={[{ required: true, message: t('o_que_e_testado_outro_required') }]}
                    >
                    <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="inicio_testes"
                    label={t('inicio_testes')}
                    rules={[{ required: true, message: t('inicio_testes_required') }]}
                >
                    <Radio.Group onChange={onChange}>
                    {[
                        { value: 'antes_funcionalidade', label: t('inicio_testes_options.antes_funcionalidade') },
                        { value: 'durante_funcionalidade', label: t('inicio_testes_options.durante_funcionalidade') },
                        { value: 'apos_prototipo', label: t('inicio_testes_options.apos_prototipo') },
                        { value: 'apos_funcionalidades_principais', label: t('inicio_testes_options.apos_funcionalidades_principais') },
                        { value: 'fim', label: t('inicio_testes_options.fim') },
                        { value: 'quando_possivel', label: t('inicio_testes_options.quando_possivel') },
                        { value: 'nunca', label: t('inicio_testes_options.nunca') },
                        { value: 'outro', label: t('inicio_testes_options.outro') }
                    ].map((opt) => (
                        <Radio key={opt.value} value={opt.value}>
                        {opt.label}
                        </Radio>
                    ))}
                    </Radio.Group>
                </Form.Item>

                {otherSelected && (
                    <Form.Item
                    name="inicio_testes_outro"
                    label={t('inicio_testes_outro_descricao')}
                    rules={[{ required: true, message: t('inicio_testes_outro_required') }]}
                    >
                    <Input />
                    </Form.Item>
                )}

               
                <Form.Item
                    name="como_automatiza"
                    label={t('como_automatiza')}
                    rules={[{ required: true, message: t('como_automatiza_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'framework_proprio', label: t('como_automatiza_options.framework_proprio') },
                        { value: 'framework_engine', label: t('como_automatiza_options.framework_engine') },
                        { value: 'framework_aparte', label: t('como_automatiza_options.framework_aparte') },
                        { value: 'outro', label: t('como_automatiza_options.outro') }
                    ]} onChange={onChange} />
                </Form.Item>

                {otherSelected && (
                    <Form.Item
                    name="como_automatiza_outro"
                    label={t('como_automatiza_outro_descricao')}
                    rules={[{ required: true, message: t('como_automatiza_outro_required') }]}
                    >
                    <Input />
                    </Form.Item>
                )}

                 {otherSelected && (
                    <Form.Item name="framework_teste_2" label={t('framework_teste_2')}>
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="teste_como_requisito"
                    label={t('teste_como_requisito')}
                    rules={[{ required: true, message: t('teste_como_requisito_required') }]}
                >
                    <Radio.Group onChange={onChange}>
                    {[
                        { value: 'no', label: t('no') },
                        { value: 'aceitar_atualizacao', label: t('teste_como_requisito_options.aceitar_atualizacao') },
                        { value: 'definir_bom_para_fase', label: t('teste_como_requisito_options.definir_bom_para_fase') },
                        { value: 'iniciar_nova_funcionalidade', label: t('teste_como_requisito_options.iniciar_nova_funcionalidade') },
                        { value: 'nunca_trabalhei', label: t('teste_como_requisito_options.nunca_trabalhei') },
                        { value: 'outro', label: t('teste_como_requisito_options.outro') }
                    ].map(opt => (
                        <Radio key={opt.value} value={opt.value}>
                        {opt.label}
                        </Radio>
                    ))}
                    </Radio.Group>
                </Form.Item>

                {otherSelected && (
                    <Form.Item
                    name="teste_como_requisito_outro"
                    label={t('teste_como_requisito_outro_descricao')}
                    rules={[{ required: true, message: t('teste_como_requisito_outro_required') }]}
                    >
                    <Input />
                    </Form.Item>
                )}
            </>
            )}    

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
