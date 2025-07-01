import React, { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, FloatButton, Popconfirm, Form, Input, Button, Checkbox, Select, Radio, InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';


const SurveyForm = ({ data, setData, uiid, onAnswer,onReset }) => {
    const [form] = Form.useForm();

    const { t, i18n } = useTranslation();

    const [selecteds, setSelecteds] = useState(data);
    const [loading, setLoading] = useState(false);

    const artist_selcted = (selecteds['papel']?.includes('artista')||selecteds['papel']?.includes('artista_som'))
    const design_selected = selecteds['papel']?.includes('game_designer')||selecteds['papel']?.includes('level_designer')
    const tester_selected = selecteds['papel']?.includes('programador')||selecteds['papel']?.includes('qa')

    form.setFieldsValue(data);
    useEffect(() => {
        if (uiid) {
          setData(selecteds)
        }
      }, [selecteds])


    const onFinish = async (values) => {
        setLoading(true)
        const dataCollums = ['uid',"language",'formacao','where_from','how_old','area_formacao',
            'area_formacao_outro','situacao','anos_experiencia','tamanho_maior_time','qtd_projetos',
            'frequencia_problemas_tecnicos','problema_codigo_confuso','problema_muitas_features',
            'problema_dificuldade_manutencao','problema_dificuldade_testar','papel','papel_outro',
            'ferramentas_desenvolvimento', "ferramentas_outro_descricao","tipos_jogos","tipos_jogos_outro_descricao",
            "plataformas_desenvolvimento","plataformas_outro_descricao","processos_engenharia","areas_uso_ia",
            "areas_uso_ia_outro","temores_uso_ia","temores_uso_ia_outro",
            "processos_outro_descricao","opiniao_praticas","opiniao_praticas_outro_descricao","opiniao_praticas_porque",
            "asset_testes","asset_testes_outro_descricao","asset_testes_automatizado_descricao","design_modelagem",
            "design_modelagem_outro_descricao","design_validacao","design_validacao_outro_descricao","testes_jogo",
            "testes_jogo_outro","dificuldades_testes","dificuldades_testes_outro","ferramentas_teste",
            "ferramentas_teste_outro","conteudo_testado","conteudo_testado_outro","etapa_testes","etapa_testes_outro",
            "uso_testes","uso_testes_outro","consideracoes_finais",'contato_entrevista',"email",
        ]
        // Filtrar os valores para manter apenas as chaves de dataCollums
        const filteredValues = Object.fromEntries(
            dataCollums.map(key => [key, values[key]])
        );

        const body_request = JSON.stringify(filteredValues);
        const url = 'https://script.google.com/macros/s/AKfycbw3MdZWgRR5C5ETJLKsTITbsS_BnQAPeS1BbgG9glKm7DNYju93oeC4-VgI6vMenicn/exec';

        try {
            fetch(url, {
                method: 'POST',
                mode: "no-cors",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body_request
            }).then((response) => {
                console.log(response);
            })
                .then((data) => {
                    console.log("Success:", data)
                    onAnswer();
                        setLoading(false)
                }
                )
                .catch((error) => {console.error("Error:", error);setLoading(false)});
        } catch (error) {
            console.error('Erro ao enviar dados:', error.message);
            setLoading(false)
        }
    };
    let index = 1


    return (
        <Card
            style={{ maxWidth: "93%", margin: '2rem auto' }}
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
                <Form.Item name="how_old" label={(index++)+"-"+t('howold')} >
                    <InputNumber />
                </Form.Item>
                <Form.Item name="where_from" label={(index++)+"-"+t('ufrom')} >
                    <Input />
                </Form.Item>
                <Form.Item name="formacao" label={(index++)+"-"+t('formacao')} rules={[{ required: true, message: t('formacao_required') }]}>
                   <Radio.Group style={{ display: 'flex', flexDirection: 'column' }}>
                    <Radio value="nenhum">{t('formacao_opcoes.none')}</Radio>
                    <Radio value="fundamental">{t('formacao_opcoes.fundamental')}</Radio>
                    <Radio value="medio">{t('formacao_opcoes.medio')}</Radio>
                    <Radio value="graduacao">{t('formacao_opcoes.graduacao')}</Radio>
                    <Radio value="especializacao">{t('formacao_opcoes.especializacao')}</Radio>
                    <Radio value="mestrado">{t('formacao_opcoes.mestrado')}</Radio>
                    <Radio value="doutorado">{t('formacao_opcoes.doutorado')}</Radio>
                </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="area_formacao"
                    label={(index++)+"-"+t('area_formacao_descricao')}
                    rules={[{ required: true, message: t('area_formacao_required') }]}
                >
                    <Radio.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        <Radio value="computacao">{t('area_formacao.computacao')}</Radio>
                        <Radio value="engenharia">{t('area_formacao.engenharia')}</Radio>
                        <Radio value="jogos">{t('area_formacao.jogos')}</Radio>
                        <Radio value="design">{t('area_formacao.design')}</Radio>
                        <Radio value="musica">{t('area_formacao.musica')}</Radio>
                        <Radio value="comunicacao">{t('area_formacao.comunicacao')}</Radio>
                        <Radio value="autodidata">{t('area_formacao.autodidata')}</Radio>
                        <Radio value="outro">{t('area_formacao.outra')}</Radio>
                    </Radio.Group>
                </Form.Item>

                {selecteds['area_formacao']=='outro' && (
                    <Form.Item
                    name="area_formacao_outro"
                    label={(index-1)+"a-"+t('area_formacao_outro_descreva')}
                    rules={[{ required: true, message: t('4a-'+'area_formacao_outro_required') }]}
                    >
                    <Input />
                    </Form.Item>
                )}
                <Form.Item name="anos_experiencia" label={(index++)+"-"+t('anos_experiencia')} rules={[{ required: true }]}>
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item name="qtd_projetos" label={(index++)+"-"+t('qtd_projetos')} rules={[{ required: true }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item
                    name="situacao"
                    label={(index++)+"-"+t('situacao.label')}
                    rules={[{ required: true, message: t('option_required') }]}
                >
                    <Radio.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        <Radio value="atuacao_industria_integral">
                            {t('situacao.atuacao_industria_integral')}
                        </Radio>
                        <Radio value="atuacao_industria_parcial">
                            {t('situacao.atuacao_industria_parcial')}
                        </Radio>
                        <Radio value="atuacao_freelancer">
                            {t('situacao.atuacao_freelancer')}
                        </Radio>
                        <Radio value="atuacao_indie_horas_vagas">
                            {t('situacao.atuacao_indie_horas_vagas')}
                        </Radio>
                        <Radio value="atuacao_eventual">
                            {t('situacao.atuacao_eventual')}
                        </Radio>
                        <Radio value="atuacao_nao_envolvido">
                            {t('situacao.atuacao_nao_envolvido')}
                        </Radio>
                    </Radio.Group>
                </Form.Item>


                <Form.Item name="tamanho_maior_time" label={(index++)+"-"+t('tamanho_maior_time')} rules={[{ required: true }]}>
                    <Radio.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        <Radio value="individual">{t('situacao_equipe.individual')}</Radio>
                        <Radio value="pequena">{t('situacao_equipe.pequena')}</Radio>
                        <Radio value="media">{t('situacao_equipe.media')}</Radio>
                        <Radio value="grande">{t('situacao_equipe.grande')}</Radio>
                        <Radio value="varia">{t('situacao_equipe.varia')}</Radio>
                        <Radio value="nao_participa">{t('situacao_equipe.nao_participa')}</Radio>
                    </Radio.Group>
                </Form.Item>

            </Card>
            <Card title={t('desafios')}>

            <Form.Item
                name="frequencia_problemas_tecnicos"
                label={(index++)+"-"+t('frequencia_problemas_tecnicos')}
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
                label={(index++)+"-"+t('problema_codigo_confuso')}
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
                label={(index++)+"-"+t('problema_muitas_features')}
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
                label={(index++)+"-"+t('problema_dificuldade_manutencao')}
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
                label={(index++)+"-"+t('problema_dificuldade_testar')}
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
                <Form.Item
                    name="papel"
                    label={(index++)+"-"+t('papel')}
                    rules={[{ required: true, message: t('papel_required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        <Checkbox value="programador">{t('papel_programador')}</Checkbox>
                        <Checkbox value="artista">{t('papel_artista')}</Checkbox>
                        <Checkbox value="game_designer">{t('papel_game_designer')}</Checkbox>
                        <Checkbox value="level_designer">{t('papel_level_designer')}</Checkbox>
                        <Checkbox value="qa">{t('papel_qa')}</Checkbox>
                        <Checkbox value="artista_som">{t('papel_artista_som')}</Checkbox>
                        <Checkbox value="outro">{t('papel_outro')}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                {selecteds['papel']?.includes('outro') && (
                    <Form.Item
                        name="papel_outro"
                        label={(index-1)+"a-"+t('papel_outro_descreva')}
                        rules={[{ required: true, message: t('papel_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="tipos_jogos"
                    label={(index++)+"-"+t('tipos_jogos')}
                    rules={[{ required: true, message: t('tipos_jogos_required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }} options={[
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

                {selecteds['tipos_jogos']?.includes('outro') && (
                    <Form.Item
                        name="tipos_jogos_outro_descricao"
                        label={(index-1)+"a-"+t('tipos_jogos_outro_descricao')}
                        rules={[{ required: true, message: t('tipos_jogos_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="plataformas_desenvolvimento"
                    label={(index++)+"-"+t('plataformas')}
                    rules={[{ required: true, message: t('plataformas_required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}
                        options={[
                            { value: 'pc', label: t('plataformas_options.pc') },
                            { value: 'web', label: t('plataformas_options.web') },
                            { value: 'mobile', label: t('plataformas_options.mobile') },
                            { value: 'console', label: t('plataformas_options.console') },
                            { value: 'xr', label: t('plataformas_options.xr') },
                            { value: 'outro', label: t('plataformas_options.outro') }
                        ].map(opt => ({ label: opt.label, value: opt.value }))}
                    />
                </Form.Item>

                {selecteds['plataformas_desenvolvimento']?.includes('outro') && (
                    <Form.Item
                        name="plataformas_outro_descricao"
                        label={(index-1)+"a-"+t('plataformas_outro_descricao')}
                        rules={[{ required: true, message: t('plataformas_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}


                <Form.Item
                    name="ferramentas_desenvolvimento"
                    label={(index++)+"-"+t('ferramentas_desenvolvimento')}
                    rules={[{ required: true, message: t('ferramentas_desenvolvimento_required') }]}
                >
                      <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }} options={[
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

                {selecteds['ferramentas_desenvolvimento']?.includes('outro') && (
                    <Form.Item
                    name="ferramentas_outro_descricao"
                    label={(index-1)+"a-"+t('ferramentas_outro_descricao')}
                    rules={[{ required: true, message: t('ferramentas_outro_required') }]}
                    >
                    <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="processos_engenharia"
                    label={(index++)+"-"+t('processos_engenharia')}
                    rules={[{ required: true, message: t('processos_engenharia_required') }]}
                >
                      <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}  options={[
                        { label: t('processos_options.controle_versao'), value: 'controle_versao' },
                        { label: t('processos_options.padroes_design'), value: 'padroes_design' },
                        { label: t('processos_options.modelagem_projeto'), value: 'modelagem_projeto' },
                        { label: t('processos_options.prototipacao'), value: 'prototipacao' },
                        { label: t('processos_options.tdd'), value: 'tdd' },
                        { label: t('processos_options.outro'), value: 'outro' },
                    ].map(opt => ({ label: opt.label, value: opt.value }))} />
                </Form.Item>

                {selecteds['processos_engenharia']?.includes('outro') && (
                    <Form.Item
                    name="processos_outro_descricao"
                    label={(index-1)+"a-"+t('processos_outro_descricao')}
                    rules={[{ required: true, message: t('processos_outro_required') }]}
                    >
                    <Input />
                    </Form.Item>
                )}

                <Form.Item name="opiniao_praticas" label={(index++)+"-"+t('opiniao_praticas')} >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}  options={[
                        { label: t('processos_options.controle_versao'), value: 'controle_versao' },
                        { label: t('processos_options.padroes_design'), value: 'padroes_design' },
                        { label: t('processos_options.modelagem_projeto'), value: 'modelagem_projeto' },
                        { label: t('processos_options.prototipacao'), value: 'prototipacao' },
                        { label: t('processos_options.tdd'), value: 'tdd' },
                        { label: t('processos_options.outro'), value: 'outro' },
                    ].map(opt => ({ label: opt.label, value: opt.value }))} />
                </Form.Item>

                {selecteds['opiniao_praticas']?.includes('outro') && (
                    <Form.Item
                        name="opiniao_praticas_outro_descricao"
                        label={(index-1)+"a-"+t('processos_outro_descricao')}
                        rules={[{ required: true, message: t('processos_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
                <Form.Item name="opiniao_praticas_porque" label={(index++)+"-"+t('opiniao_praticas_porque')}
                           rules={[{ required: selecteds['opiniao_praticas']?.length >0,message:t("asset_testes_automatizado_required") }]}>
                    <Input.TextArea disabled={selecteds['opiniao_praticas']?.length===0} rows={3} />
                </Form.Item>
                <Form.Item
                    name="areas_uso_ia"
                    label={(index++)+"-"+t('areas_uso_ia.label')}
                    rules={[{ required: true, message: t('areas_uso_ia.required') }]}
                >
                    <Checkbox.Group>
                        <Checkbox value="arte">{t('areas_uso_ia.options.arte')}</Checkbox>
                        <Checkbox value="vfx">{t('areas_uso_ia.options.vfx')}</Checkbox>
                        <Checkbox value="sfx">{t('areas_uso_ia.options.sfx')}</Checkbox>
                        <Checkbox value="voz">{t('areas_uso_ia.options.voz')}</Checkbox>
                        <Checkbox value="localizacao">{t('areas_uso_ia.options.localizacao')}</Checkbox>
                        <Checkbox value="programacao">{t('areas_uso_ia.options.programacao')}</Checkbox>
                        <Checkbox value="design">{t('areas_uso_ia.options.design')}</Checkbox>
                        <Checkbox value="historia">{t('areas_uso_ia.options.historia')}</Checkbox>
                        <Checkbox value="dialogo">{t('areas_uso_ia.options.dialogo')}</Checkbox>
                        <Checkbox value="outro">{t('areas_uso_ia.options.outro')}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {selecteds.areas_uso_ia?.includes('outro') && (
                    <Form.Item
                        name="areas_uso_ia_outro"
                        label={(index-1)+"a-"+t('areas_uso_ia.outro_descreva')}
                        rules={[{ required: true, message: t('areas_uso_ia.outro_descreva') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="temores_uso_ia"
                    label={(index++)+"-"+t('temores_uso_ia.label')}
                    rules={[{ required: true, message: t('temores_uso_ia.required') }]}
                >
                    <Checkbox.Group>
                        <Checkbox value="dados_treinamento">{t('temores_uso_ia.options.dados_treinamento')}</Checkbox>
                        <Checkbox value="uso_indesejado">{t('temores_uso_ia.options.uso_indesejado')}</Checkbox>
                        <Checkbox value="substituicao">{t('temores_uso_ia.options.substituicao')}</Checkbox>
                        <Checkbox value="falta_transparencia">{t('temores_uso_ia.options.falta_transparencia')}</Checkbox>
                        <Checkbox value="outro">{t('temores_uso_ia.options.outro')}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {selecteds.temores_uso_ia?.includes('outro') && (
                    <Form.Item
                        name="temores_uso_ia_outro"
                        label={(index-1)+"a-"+t('temores_uso_ia.outro_descreva')}
                        rules={[{ required: true, message: t('temores_uso_ia.outro_descreva') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Card>

            <Card title={t("artistis_profile")}>
                <Form.Item
                    name="asset_testes"
                    label={(index++)+"-"+t('asset_testes')}
                    rules={[{ required: artist_selcted, message: t('asset_testes_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'visual_manual', label: t('asset_testes_options.teste_visual_manual') },
                        { value: 'com_equipe', label: t('asset_testes_options.teste_com_equipe') },
                        { value: 'automatizado', label: t('asset_testes_options.teste_automatizado') },
                        { value: 'nao_sei', label: t('asset_testes_options.teste_nao_sei') },
                        { value: 'nao_sao_testados', label: t('asset_testes_options.teste_nao_sao_testados') },
                        { value: 'outro', label: t('asset_testes_options.teste_outro') },
                    ]} />
                </Form.Item>
                    {selecteds['asset_testes']?.includes('outro') && (
                        <Form.Item
                            name="asset_testes_outro_descricao"
                            label={(index-1)+"a-"+t('asset_testes_outro_descricao')}
                            rules={[{ required: true, message: t('asset_testes_outro_descricao_required') }]}
                        >
                            <Input />
                        </Form.Item>
                    )}
                {selecteds['asset_testes']?.includes('automatizado') && (
                    <Form.Item
                        name="asset_testes_automatizado_descricao"
                        label={(index-1)+"b-"+t('asset_testes_automatizado_descricao')}
                        rules={[{ required: true, message: t('asset_testes_automatizado_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Card>



            <Card title={t("designer_profile")}>
                <Form.Item
                    name="design_modelagem"
                    label={(index++)+"-"+t('design_modelagem')}
                    rules={[{ required: design_selected, message: t('design_modelagem_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'uml', label: t('design_modelagem_options.uml') },
                        { value: 'prototipo_real', label: t('design_modelagem_options.prototipo_real') },
                        { value: 'prototipo_ferramenta', label: t('design_modelagem_options.prototipo_ferramenta') },
                        { value: 'anotacoes_simples', label: t('design_modelagem_options.anotacoes_simples') },
                        { value: 'mental', label: t('design_modelagem_options.mental') },
                        { value: 'outro', label: t('design_modelagem_options.outro') },
                    ]} />
                </Form.Item>

                {selecteds['design_modelagem']?.includes('outro') && (
                    <Form.Item
                        name="design_modelagem_outro_descricao"
                        label={(index-1)+"a-"+t('design_modelagem_outro_descricao')}
                        rules={[{ required: true, message: t('design_modelagem_outro_descricao_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="design_validacao"
                    label={(index++)+"-"+t('design_validacao')}
                    rules={[{ required: design_selected, message: t('design_validacao_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'prototipo_simplificado', label: t('design_validacao_options.prototipo_simplificado') },
                        { value: 'prototipo_real', label: t('design_validacao_options.prototipo_real') },
                        { value: 'excel', label: t('design_validacao_options.excel') },
                        { value: 'machinations', label: t('design_validacao_options.machinations') },
                        { value: 'mental', label: t('design_validacao_options.mental') },
                        { value: 'outro', label: t('design_validacao_options.outro') },
                    ]} />
                </Form.Item>

                {selecteds['design_validacao']?.includes('outro') && (
                    <Form.Item
                        name="design_validacao_outro_descricao"
                        label={(index-1)+"a-"+t('design_validacao_outro_descricao')}
                        rules={[{ required: true, message: t('design_validacao_outro_descricao_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

            </Card>



            <Card title={t("tecnical_profile")}>
                <Form.Item
                    name="testes_jogo"
                    label={(index++)+"-"+t('testes_jogo')}
                    rules={[{ required: tester_selected, message: t('testes_jogo_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'exploratorio', label: t('testes_jogo_options.exploratorio') },
                        { value: 'roteiro', label: t('testes_jogo_options.roteiro') },
                        { value: 'automatizado', label: t('testes_jogo_options.automatizado') },
                        { value: 'outro', label: t('testes_jogo_options.outro') },
                    ]} />
                </Form.Item>

                {selecteds['testes_jogo']?.includes('outro') && (
                    <Form.Item
                        name="testes_jogo_outro"
                        label={(index-1)+"a-"+t('testes_jogo_outro')}
                        rules={[{ required: true, message: t('testes_jogo_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
                <Form.Item
                    name="dificuldades_testes"
                    label={(index++)+"-"+t('dificuldades_testes')}
                    rules={[{ required: tester_selected, message: t('dificuldades_testes_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'entendimento_frameworks', label: t('dificuldades_testes_options.entendimento_frameworks') },
                        { value: 'preferencia_humanos', label: t('dificuldades_testes_options.preferencia_humanos') },
                        { value: 'implementacao_dificil', label: t('dificuldades_testes_options.implementacao_dificil') },
                        { value: 'nao_encontram_erros_reais', label: t('dificuldades_testes_options.nao_encontram_erros_reais') },
                        { value: 'outro', label: t('dificuldades_testes_options.outro') }
                    ]} />
                </Form.Item>

                {selecteds['dificuldades_testes']?.includes('outro') && (
                    <Form.Item
                        name="dificuldades_testes_outro"
                        label={(index-1)+"a-"+t('dificuldades_testes_outro')}
                        rules={[{ required: true, message: t('dificuldades_testes_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="ferramentas_teste"
                    label={(index++)+"-"+t('ferramentas_teste')}
                    rules={[{ required: selecteds['testes_jogo']?.includes('automatizado'), message: t('ferramentas_teste_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'robotframework', label: t('ferramentas_teste_options.robotframework') },
                        { value: 'selenium', label: t('ferramentas_teste_options.selenium') },
                        { value: 'appium', label: t('ferramentas_teste_options.appium') },
                        { value: 'unity', label: t('ferramentas_teste_options.unity') },
                        { value: 'unreal_functional', label: t('ferramentas_teste_options.unreal_functional') },
                        { value: 'unreal_gauntlet', label: t('ferramentas_teste_options.unreal_gauntlet') },
                        { value: 'outro', label: t('ferramentas_teste_options.outro') }
                    ]} />
                </Form.Item>

                {selecteds['ferramentas_teste']?.includes('outro') && (
                    <Form.Item
                        name="ferramentas_teste_outro"
                        label={(index-1)+"a-"+t('ferramentas_teste_outro')}
                        rules={[{ required: true, message: t('ferramentas_teste_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="conteudo_testado"
                    label={(index++)+"-"+t('conteudo_testado')}
                    rules={[{ required: selecteds['testes_jogo']?.includes('automatizado'), message: t('conteudo_testado_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'componentes', label: t('conteudo_testado_options.componentes') },
                        { value: 'performance', label: t('conteudo_testado_options.performance') },
                        { value: 'cenarios', label: t('conteudo_testado_options.cenarios') },
                        { value: 'acoes_personagem', label: t('conteudo_testado_options.acoes_personagem') },
                        { value: 'teste_fumaca', label: t('conteudo_testado_options.teste_fumaca') },
                        { value: 'outro', label: t('conteudo_testado_options.outro') }
                    ]} />
                </Form.Item>

                {selecteds['conteudo_testado']?.includes('outro') && (
                    <Form.Item
                        name="conteudo_testado_outro"
                        label={(index-1)+"a-"+t('conteudo_testado_outro')}
                        rules={[{ required: true, message: t('conteudo_testado_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
                <Form.Item
                    name="etapa_testes"
                    label={(index++)+"-"+t('etapa_testes')}
                    rules={[{ required: selecteds['testes_jogo']?.includes('automatizado'), message: t('etapa_testes_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'antes_funcionalidade', label: t('etapa_testes_options.antes_funcionalidade') },
                        { value: 'durante_funcionalidade', label: t('etapa_testes_options.durante_funcionalidade') },
                        { value: 'pos_prototipo', label: t('etapa_testes_options.pos_prototipo') },
                        { value: 'pos_funcionalidades', label: t('etapa_testes_options.pos_funcionalidades') },
                        { value: 'no_fim', label: t('etapa_testes_options.no_fim') },
                        { value: 'quando_possivel', label: t('etapa_testes_options.quando_possivel') },
                        { value: 'outro', label: t('etapa_testes_options.outro') }
                    ]} />
                </Form.Item>

                {selecteds['etapa_testes']?.includes('outro') && (
                    <Form.Item
                        name="etapa_testes_outro"
                        label={(index-1)+"a-"+t('etapa_testes_outro')}
                        rules={[{ required: true, message: t('etapa_testes_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="uso_testes"
                    label={(index++)+"-"+t('uso_testes')}
                    rules={[{ required: selecteds['testes_jogo']?.includes('automatizado'), message: t('uso_testes_required') }]}
                >
                    <Checkbox.Group options={[
                        { value: 'nao', label: t('uso_testes_options.nao') },
                        { value: 'atualizacao', label: t('uso_testes_options.atualizacao') },
                        { value: 'proxima_fase', label: t('uso_testes_options.proxima_fase') },
                        { value: 'nova_funcionalidade', label: t('uso_testes_options.nova_funcionalidade') },
                        { value: 'outro', label: t('uso_testes_options.outro') }
                    ]} />
                </Form.Item>

                {selecteds['uso_testes']?.includes('outro') && (
                    <Form.Item
                        name="uso_testes_outro"
                        label={(index-1)+"a-"+t('uso_testes_outro')}
                        rules={[{ required: true, message: t('uso_testes_outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Card>


            <Card title={t("final_remarks")}>
            <Form.Item name="consideracoes_finais" label={(index++)+"-"+t('consideracoes_finais')}>
                <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item name="contato_entrevista" label={(index++)+"-"+t('contato_entrevista')} rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value="sim">{t('sim')}</Radio>
                    <Radio value="nao">{t('nao')}</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="email" required={selecteds["contato_entrevista"]==="sim"}
                       label={"35-"+
                           (selecteds["contato_entrevista"]==="sim"?t('email_contato'):t('email'))}>
                <Input type="email" />
            </Form.Item>
            </Card>
            <Form.Item>
                <Button loading={loading} type="primary" block htmlType="submit">{t('enviar')}</Button>
            </Form.Item>

        </Form>
        </Card>
    );
};

export default SurveyForm;
