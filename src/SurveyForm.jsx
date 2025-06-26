import React, { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, FloatButton, Popconfirm, Form, Input, Button, Checkbox, Select, Radio, InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';


const SurveyForm = ({ data, setData, uiid, onAnswer,onReset }) => {
    const [form] = Form.useForm();

    const { t, i18n } = useTranslation();

    const [selecteds, setSelecteds] = useState(data);
    form.setFieldsValue(data);
    useEffect(() => {
        if (uiid) {
          setData(selecteds)
        }
      }, [selecteds])


    const onFinish = async (values) => {
        console.log('Respostas:', values);
        const dataCollums = ['uid',"language",'formacao','where_from','how_old','area_formacao',
            'area_formacao_outro','independent','anos_experiencia','tamanho_maior_time','qtd_projetos',
            'frequencia_problemas_tecnicos','problema_codigo_confuso','problema_muitas_features',
            'problema_dificuldade_manutencao','problema_dificuldade_testar','papel','papel_outro','papel_principal',
            'papel_principal_outro','papel_favorito','papel_favorito_outro','ferramentas_desenvolvimento',
            "ferramentas_outro_descricao","tipos_jogos","tipos_jogos_outro_descricao","processos_engenharia",
            "processos_outro_descricao"]
        // Filtrar os valores para manter apenas as chaves de dataCollums
        const filteredValues = Object.fromEntries(
            dataCollums.map(key => [key, values[key]])
        );
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbyOT3aRqac-aTy2Huzno439QHC0nZf_Svf--3TuTQRZn15OJ8n1NO0KEoKj3vU87xVX/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filteredValues),
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
        <Card
            style={{ maxWidth: "93%", margin: '2rem auto' }}
            bodyStyle={{ padding: '1.5rem' }}
        >
            <Popconfirm
                title={t('confirmReset')}
                description={t('confirmResetDescription')}
                onConfirm={onReset}
                okText={t('sim')}
                cancelText={t('nao')}
                okType={"danger"}
            >
                <FloatButton
                    icon={<CloseOutlined />}
                    tooltip={t('desistir')}
                    style={{
                        backgroundColor: '#ff4d4f',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                    className="float-button-danger"
                />
            </Popconfirm>
        <Form
            onValuesChange={(changed, all) => {
                setSelecteds(all);
            }}
            form={form} layout="vertical" onFinish={onFinish}
        >
            <Form.Item name="uid" initialValue={uiid} hidden>
                <Input value={uiid} type="hidden" />
            </Form.Item>
            <Form.Item name="language" initialValue={i18n.languages[0]} hidden>
                <Input value={i18n.languages[0]} type="hidden" />
            </Form.Item>

            <Card  title={t("pessoal")} >
            <Form.Item name="formacao" label={"1-"+t('formacao')} rules={[{ required: true, message: t('formacao_required') }]}>
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

            <Form.Item name="where_from" label={"2-"+t('ufrom')} >
                <Input />
            </Form.Item>
            <Form.Item name="how_old" label={"3-"+t('howold')} >
                <InputNumber />
            </Form.Item>

            <Form.Item
                name="area_formacao"
                label={"4-"+t('area_formacao')}
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
                label={"4a-"+t('area_formacao_outro_descreva')}
                rules={[{ required: true, message: t('4a-'+'area_formacao_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            <Form.Item
                name="independent"
                label={'5 - ' + t('independent.label')}
                rules={[{ required: true, message: t('option_required') }]}
            >
                <Radio.Group>
                    <Radio value="atuacao_indie_horas_vagas">
                        {t('independent.atuacao_indie_horas_vagas')}
                    </Radio>
                    <Radio value="atuacao_indie_renda_principal">
                        {t('independent.atuacao_indie_renda_principal')}
                    </Radio>
                    <Radio value="atuacao_nao_indie_mas_participo">
                        {t('independent.atuacao_nao_indie_mas_participo')}
                    </Radio>
                    <Radio value="atuacao_nao_trabalho_com_desenvolvimento">
                        {t('independent.atuacao_nao_trabalho_com_desenvolvimento')}
                    </Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="anos_experiencia" label={'6-'+t('anos_experiencia')} rules={[{ required: true }]}>
                <InputNumber min={0} />
            </Form.Item>
            </Card>
            <Card title={t('team')}>
            <Form.Item name="tamanho_maior_time" label={'7-'+t('tamanho_maior_time')} rules={[{ required: true }]}>
                <InputNumber min={1} />
            </Form.Item>

            <Form.Item name="qtd_projetos" label={'8-'+t('qtd_projetos')} rules={[{ required: true }]}>
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                name="frequencia_problemas_tecnicos"
                label={'9-'+t('frequencia_problemas_tecnicos')}
                rules={[{ required: true, message: t('option_required') }]}
            >
                <Radio.Group>
                    <Radio.Button value="nunca">{t('frequencia_nunca')}</Radio.Button>
                    <Radio.Button value="raramente">{t('frequencia_raramente')}</Radio.Button>
                    <Radio.Button value="as_vezes">{t('frequencia_as_vezes')}</Radio.Button>
                    <Radio.Button value="frequentemente">{t('frequencia_frequentemente')}</Radio.Button>
                    <Radio.Button value="quase_sempre">{t('frequencia_quase_sempre')}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                name="problema_codigo_confuso"
                label={'10-'+t('problema_codigo_confuso')}
                rules={[{ required: true, message: t('option_required') }]}
            >
                <Radio.Group>
                    <Radio.Button value="nunca">{t('frequencia_nunca')}</Radio.Button>
                    <Radio.Button value="raramente">{t('frequencia_raramente')}</Radio.Button>
                    <Radio.Button value="as_vezes">{t('frequencia_as_vezes')}</Radio.Button>
                    <Radio.Button value="frequentemente">{t('frequencia_frequentemente')}</Radio.Button>
                    <Radio.Button value="quase_sempre">{t('frequencia_quase_sempre')}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                name="problema_muitas_features"
                label={'11-'+t('problema_muitas_features')}
                rules={[{ required: true, message: t('option_required') }]}
            >
                <Radio.Group>
                    <Radio.Button value="nunca">{t('frequencia_nunca')}</Radio.Button>
                    <Radio.Button value="raramente">{t('frequencia_raramente')}</Radio.Button>
                    <Radio.Button value="as_vezes">{t('frequencia_as_vezes')}</Radio.Button>
                    <Radio.Button value="frequentemente">{t('frequencia_frequentemente')}</Radio.Button>
                    <Radio.Button value="quase_sempre">{t('frequencia_quase_sempre')}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                name="problema_dificuldade_manutencao"
                label={'12-'+t('problema_dificuldade_manutencao')}
                rules={[{ required: true, message: t('option_required') }]}
            >
                <Radio.Group>
                    <Radio.Button value="nunca">{t('frequencia_nunca')}</Radio.Button>
                    <Radio.Button value="raramente">{t('frequencia_raramente')}</Radio.Button>
                    <Radio.Button value="as_vezes">{t('frequencia_as_vezes')}</Radio.Button>
                    <Radio.Button value="frequentemente">{t('frequencia_frequentemente')}</Radio.Button>
                    <Radio.Button value="quase_sempre">{t('frequencia_quase_sempre')}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                name="problema_dificuldade_testar"
                label={'13-'+t('problema_dificuldade_testar')}
                rules={[{ required: true, message: t('option_required') }]}
            >
                <Radio.Group>
                    <Radio.Button value="nunca">{t('frequencia_nunca')}</Radio.Button>
                    <Radio.Button value="raramente">{t('frequencia_raramente')}</Radio.Button>
                    <Radio.Button value="as_vezes">{t('frequencia_as_vezes')}</Radio.Button>
                    <Radio.Button value="frequentemente">{t('frequencia_frequentemente')}</Radio.Button>
                    <Radio.Button value="quase_sempre">{t('frequencia_quase_sempre')}</Radio.Button>
                </Radio.Group>
            </Form.Item>
            </Card>
            <Card title={t('game_dev_profile')}>
            {/**
             Perifl testador e QA
             Perfil geral
             **/}
            <Form.Item
                name="papel"
                label={'14-'+t('papel')}
                rules={[{ required: true, message: t('papel_required') }]}
            >
                <Checkbox.Group>
                    <Checkbox value="programador">{t('papel_programador')}</Checkbox>
                    <Checkbox value="artista">{t('papel_artista')}</Checkbox>
                    <Checkbox value="game_designer">{t('papel_game_designer')}</Checkbox>
                    <Checkbox value="level_designer">{t('papel_level_designer')}</Checkbox>
                    <Checkbox value="qa">{t('papel_qa')}</Checkbox>
                    <Checkbox value="artista_som">{t('papel_artista_som')}</Checkbox>
                    <Checkbox value="outro">{t('papel_outro')}</Checkbox>
                </Checkbox.Group>
            </Form.Item>
            {selecteds['papel']=='outro' && (
                <Form.Item
                    name="papel_outro"
                    label={'14a-'+t('papel_outro_descreva')}
                    rules={[{ required: true, message: t('papel_outro_required') }]}
                >
                    <Input />
                </Form.Item>
            )}


            <Form.Item
                name="papel_principal"
                label={'15-'+ t('papel_principal')}
                rules={[{ required: true, message: t('papel_principal_required') }]}
            >
                <Radio.Group>
                    {['programador', 'artista', 'game_designer', 'level_designer', 'qa', 'artista_som', 'outro'].map((papel) => (
                        <Radio
                            key={papel}
                            value={papel}
                            disabled={!selecteds['papel'].includes(papel)}
                        >
                            {t(`papel_${papel}`)}
                        </Radio>
                    ))}
                </Radio.Group>
            </Form.Item>

            {selecteds['papel_principal']=='outro' && (
                <Form.Item
                name="papel_principal_outro"
                label={'15a-'+t('papel_principal_outro_descreva')}
                rules={[{ required: true, message: t('papel_principal_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            <Form.Item
                name="papel_favorito"
                label={'16-'+t('papel_favorito')}
                rules={[{ required: true, message: t('papel_required') }]}
            >
                <Radio.Group>
                    {['programador', 'artista', 'game_designer', 'level_designer', 'qa', 'artista_som', 'outro'].map((papel) => (
                        <Radio
                            key={papel}
                            value={papel}
                            disabled={!selecteds['papel'].includes(papel)}
                        >
                            {t(`papel_${papel}`)}
                        </Radio>
                    ))}
                </Radio.Group>
            </Form.Item>

            {selecteds['papel_favorito']=='outro' && (
                <Form.Item
                    name="papel_favorito_outro"
                    label={'16a-'+t('papel_outro_descreva')}
                    rules={[{ required: true, message: t('papel_outro_required') }]}
                >
                    <Input />
                </Form.Item>
            )}

            <Form.Item
                name="ferramentas_desenvolvimento"
                label={'17-'+t('ferramentas_desenvolvimento')}
                rules={[{ required: true, message: t('ferramentas_desenvolvimento_required') }]}
            >
                  <Checkbox.Group options={[
                    { value: 'unity', label: t('ferramentas_options.unity') },
                    { value: 'unreal', label: t('ferramentas_options.unreal') },
                    { value: 'godot', label: t('ferramentas_options.godot') },
                    { value: 'gamemaker', label: t('ferramentas_options.gamemaker') },
                    { value: 'rpgmaker', label: t('ferramentas_options.rpgmaker') },
                    { value: 'propria_pessoal', label: t('ferramentas_options.propria_pessoal') },
                    { value: 'propria_corporativa', label: t('ferramentas_options.propria_corporativa') },
                    { value: 'outro', label: t('ferramentas_options.outro') }
                ].map(opt => ({ label: opt.label, value: opt.value }))} />
            </Form.Item>

            {selecteds['ferramentas_desenvolvimento']=='outro' && (
                <Form.Item
                name="ferramentas_outro_descricao"
                label={'17a-'+t('ferramentas_outro_descricao')}
                rules={[{ required: true, message: t('ferramentas_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            <Form.Item
                name="tipos_jogos"
                label={'18-'+t('tipos_jogos')}
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
                ]} />
            </Form.Item>

            {selecteds['tipos_jogos']=='outro' && (
                <Form.Item
                name="tipos_jogos_outro_descricao"
                label={'18a-'+t('tipos_jogos_outro_descricao')}
                rules={[{ required: true, message: t('tipos_jogos_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            <Form.Item
                name="processos_engenharia"
                label={'19-'+t('processos_engenharia')}
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

            {selecteds['processos_engenharia']=='outro' && (
                <Form.Item
                name="processos_outro_descricao"
                label={'19-'+t('processos_outro_descricao')}
                rules={[{ required: true, message: t('processos_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            <Form.Item name="opiniao_praticas" label={t('opiniao_praticas')} rules={[{ required: true }]}>
                <Checkbox.Group options={[
                    { label: t('processos_options.controle_versao'), value: 'controle_versao' },
                    { label: t('processos_options.padroes_design'), value: 'padroes_design' },
                    { label: t('processos_options.modelagem_projeto'), value: 'modelagem_projeto' },
                    { label: t('processos_options.prototipacao'), value: 'prototipacao' },
                    { label: t('processos_options.tdd'), value: 'tdd' },
                    { label: t('processos_options.outro'), value: 'outro' },
                ].map(opt => ({ label: opt.label, value: opt.value }))} />
            </Form.Item>

            {selecteds['opiniao_praticas']=='outro' && (
                <Form.Item
                    name="opiniao_praticas_outro_descricao"
                    label={t('processos_outro_descricao')}
                    rules={[{ required: true, message: t('processos_outro_required') }]}
                >
                    <Input />
                </Form.Item>
            )}
            { selecteds['opiniao_praticas']?.length >0 && (
            <Form.Item name="opiniao_praticas_porque" label={t('opiniao_praticas_porque')} rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
            </Form.Item>
            )}
            </Card>
            {(selecteds['papel'].includes('artista')||selecteds['papel'].includes('artista_som')) &&(
            <Card title={t("artistis_profile")}>
                <Form.Item
                    name="asset_testes"
                    label={t('asset_testes')}
                    rules={[{ required: true, message: t('asset_testes_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'teste_visual_manual', label: t('asset_testes_options.teste_visual_manual') },
                        { value: 'teste_com_equipe', label: t('asset_testes_options.teste_com_equipe') },
                        { value: 'teste_automatizado', label: t('asset_testes_options.teste_automatizado') },
                        { value: 'teste_nao_sei', label: t('asset_testes_options.teste_nao_sei') },
                        { value: 'teste_nao_sao_testados', label: t('asset_testes_options.teste_nao_sao_testados') },
                        { value: 'teste_outro', label: t('asset_testes_options.teste_outro') },
                    ]} />
                </Form.Item>
                    {selecteds['asset_testes']=='outro' && (
                        <Form.Item
                            name="asset_testes_outro_descricao"
                            label={t('asset_testes_outro_descricao')}
                            rules={[{ required: true, message: t('asset_testes_outro_descricao_required') }]}
                        >
                            <Input />
                        </Form.Item>
                    )}
                {selecteds['asset_testes']=='teste_automatizado' && (
                    <Form.Item
                        name="asset_testes_automatizado_descricao"
                        label={t('asset_testes_automatizado_descricao')}
                        rules={[{ required: true, message: t('asset_testes_automatizado_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Card>
            )}

            {(selecteds['papel'].includes('game_designer')||selecteds['papel'].includes('level_designer')) &&(
                <Card title={t("designer_profile")}>
                    <Form.Item
                        name="asset_testes"
                        label={t('asset_testes')}
                        rules={[{ required: true, message: t('asset_testes_required') }]}
                    >
                        <Checkbox.Group options={[
                            { value: 'teste_visual_manual', label: t('asset_testes_options.teste_visual_manual') },
                            { value: 'teste_com_equipe', label: t('asset_testes_options.teste_com_equipe') },
                            { value: 'teste_automatizado', label: t('asset_testes_options.teste_automatizado') },
                            { value: 'teste_nao_sei', label: t('asset_testes_options.teste_nao_sei') },
                            { value: 'teste_nao_sao_testados', label: t('asset_testes_options.teste_nao_sao_testados') },
                            { value: 'teste_outro', label: t('asset_testes_options.teste_outro') },
                        ]} />
                    </Form.Item>
                    {selecteds['asset_testes']=='outro' && (
                        <Form.Item
                            name="asset_testes_outro_descricao"
                            label={t('asset_testes_outro_descricao')}
                            rules={[{ required: true, message: t('asset_testes_outro_descricao_required') }]}
                        >
                            <Input />
                        </Form.Item>
                    )}
                </Card>
            )}

            {/*
            quem
            o que é testado
            como é testado
            estrategias de testes
            Filtrar so programadores e QA
            */}
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

            {selecteds['testes']=='outro' && (
                <Form.Item
                name="testes_outro"
                label={t('testes_outro_descricao')}
                rules={[{ required: true, message: t('testes_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}

            {/*
            Colocar os framerworks de teste aqui e não na pergunta a parte
            */}
            <Form.Item
                name="usa_framework_teste"
                label={t('usa_framework_teste')}
                rules={[{ required: true, message: t('option_required') }]}
            >
                <Radio.Group>
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

            {selecteds['usa_framework_teste']=='outro' && (
                <Form.Item
                name="usa_framework_teste_outro"
                label={t('usa_framework_teste_outro_descricao')}
                rules={[{ required: true, message: t('usa_framework_teste_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}
            {selecteds['usa_framework_teste']=='framework_aparte' && (
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
                ]}  />
            </Form.Item>

            {selecteds['como_testou']=='outro' && (
                <Form.Item
                name="como_testou_outro"
                label={t('como_testou_outro_descricao')}
                rules={[{ required: true, message: t('como_testou_outro_required') }]}
                >
                <Input />
                </Form.Item>
            )}
            {selecteds['como_testou']=='automatizados' &&(
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
                    ]}  />
                </Form.Item>

                {selecteds['o_que_e_testado']=='outro' && (
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
                    rules={[{ required: true, message: t('option_required') }]}
                >
                    <Radio.Group>
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

                {selecteds['inicio_testes']=='outro'  && (
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
                    ]}  />
                </Form.Item>

                {selecteds['como_automatiza']=='outro'  && (
                    <Form.Item
                    name="como_automatiza_outro"
                    label={t('como_automatiza_outro_descricao')}
                    rules={[{ required: true, message: t('como_automatiza_outro_required') }]}
                    >
                    <Input />
                    </Form.Item>
                )}

                 {selecteds['como_automatiza']=='framework_aparte' && (
                    <Form.Item name="framework_teste_2" label={t('framework_teste_2')}>
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="teste_como_requisito"
                    label={t('teste_como_requisito')}
                    rules={[{ required: true, message: t('option_required') }]}
                >
                    <Radio.Group>
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

                {selecteds['teste_como_requisito'] == 'outro' && (
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
            {/*
            uma pergunta sobre problemas?

            testar testes integração?
            Se não marcou teste automatizado perguntar o por que?
            Perguntar dificuldade nos testes automatizados?
            */}
            <Form.Item name="consideracoes_finais" label={t('consideracoes_finais')}>
                <Input.TextArea rows={2} />
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
                <Button type="primary" block htmlType="submit">{t('enviar')}</Button>
            </Form.Item>
        </Form>
        </Card>
    );
};

export default SurveyForm;
