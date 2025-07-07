import React, { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Collapse, Table, Typography, Card, FloatButton, Popconfirm, Form, Input, Button, Checkbox, Select, Radio, InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';


const SurveyForm = ({ data, setData, uiid, onAnswer,onReset }) => {
    const [form] = Form.useForm();
    const screens = Grid.useBreakpoint();
    const { t, i18n } = useTranslation();

    const [selecteds, setSelecteds] = useState(data);
    const [loading, setLoading] = useState(false);

    const artist_selcted = ["artista","artista_som","roteiro_narrativa","design_ux"].some(role => selecteds['papel']?.includes(role));
    const design_selected = ["game_designer","level_designer"].some(role => selecteds['papel']?.includes(role));
    const tester_selected = ["programador","qa"].some(role => selecteds['papel']?.includes(role));
    const problemas_selected = ["gerente","programador","qa"].some(role => selecteds['papel']?.includes(role));

    useEffect(() => {
        form.setFieldsValue(data);
    }, [data])
    
    useEffect(() => {
        if (uiid) {
          setData(selecteds)
        }
      }, [selecteds])

    const onFinish = async (values) => {
        setLoading(true)
        const dataCollums = ['uid',"language",

            'where_from','how_old','formacao','area_formacao',
            'area_formacao_outro','anos_experiencia', 'qtd_projetos', 'situacao','tamanho_maior_time',
            "duracao_media_projetos",

            'papel','papel_outro',"tipos_jogos","tipos_jogos_outro_descricao","plataformas_desenvolvimento",
            "plataformas_outro_descricao",'ferramentas_desenvolvimento', "ferramentas_outro_descricao",
            "uso_praticas_controle_versao","uso_praticas_padroes_design","uso_praticas_modelagem_projeto",
            ,"uso_praticas_prototipacao", "uso_praticas_tdd", "integracao_continua", 
            
            "areas_uso_ia","areas_uso_ia_outro","temores_uso_ia","temores_uso_ia_outro",

            "dificuldades_manutencao","dificuldades_manutencao_outro","causas_problemas_tecnicos",
            "causas_problemas_tecnicos_outro","desafios_testes",

            "avaliacao_artefatos","avaliacao_artefatos_outro","responsavel_validacao_artefatos",
            "responsavel_validacao_artefatos_outro","percepcao_avaliacao_artefatos",

            "design_modelagem",
            "design_modelagem_outro_descricao","design_validacao","design_validacao_outro_descricao",

            "testes_jogo",
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
                    rules={[{ required: true, message: t('area_formacao_outro_required') }]}
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

                <Form.Item name="duracao_media_projetos" label={(index++) + '-' + t('duracao_media_projetos')} rules={[{ required: true }]}>
                    <Radio.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        <Radio value="menos_1_mes">{t('duracao_projetos.menos_1_mes')}</Radio>
                        <Radio value="1a3_meses">{t('duracao_projetos.1a3_meses')}</Radio>
                        <Radio value="4a6_meses">{t('duracao_projetos.4a6_meses')}</Radio>
                        <Radio value="7a12_meses">{t('duracao_projetos.7a12_meses')}</Radio>
                        <Radio value="mais_1_ano">{t('duracao_projetos.mais_1_ano')}</Radio>
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
                        <Checkbox value="gerente">{t('papel_gerente')}</Checkbox>
                        <Checkbox value="programador">{t('papel_programador')}</Checkbox>
                        <Checkbox value="artista">{t('papel_artista')}</Checkbox>
                        <Checkbox value="animacao">{t('papel_animacao')}</Checkbox>
                        <Checkbox value="design_ux">{t('papel_design_ux')}</Checkbox>
                        <Checkbox value="game_designer">{t('papel_game_designer')}</Checkbox>
                        <Checkbox value="level_designer">{t('papel_level_designer')}</Checkbox>
                        <Checkbox value="qa">{t('papel_qa')}</Checkbox>
                        <Checkbox value="artista_som">{t('papel_artista_som')}</Checkbox>
                        <Checkbox value="roteiro_narrativa">{t('papel_roteiro_narrativa')}</Checkbox>
                        <Checkbox value="marketing">{t('papel_marketing')}</Checkbox>
                        <Checkbox value="outro">{t('outro')}</Checkbox>
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
                        { label: t('outro'), value: 'outro' },
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
                        { value: 'framework_baixo_nivel', label: t('ferramentas_options.framework_baixo_nivel') },
                        { value: 'nada', label: t('ferramentas_options.nada') },
                        { value: 'outro', label: t('outro') }
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
                <Typography.Title level={5}>
                    {(index++) + ' - ' + t('uso_praticas.label')}
                </Typography.Title>
                {screens.xs ? (
  ['controle_versao',
    'padroes_design',
    'modelagem_projeto',
    'prototipacao',
    'tdd',
    'integracao_continua'].map((key) => (
    <Card key={key} style={{ marginBottom: 12 }}>
      <Typography.Text strong>{t(`uso_praticas.praticas.${key}`)}</Typography.Text>
      <Form.Item
        name={'uso_praticas_'+key}
        rules={[{ required: true, message: t('uso_praticas.required') }]}
      >
        <Radio.Group>
          {[
            'uso_atualmente',
            'nao_conhece',
            'nao_util',
            'ja_tentou',
            'prefere_outros'
        ].map((optionKey) => (
            <Radio  key={key+"_"+optionKey} value={optionKey}>{t(`uso_praticas.opcoes.${optionKey}`)}</Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </Card>
  ))
) : (
                <Table
                    bordered
                    pagination={false}
                    dataSource={[
                        'controle_versao',
                        'padroes_design',
                        'modelagem_projeto',
                        'prototipacao',
                        'tdd',
                        'integracao_continua'
                    ].map((key) => ({ key }))}
                    rowKey="key"
                >
                    <Table.Column
                        title=""
                        dataIndex="key"
                        key="pratica"
                        render={(key) => t(`uso_praticas.praticas.${key}`)}
                    />
                    {[
                        'uso_atualmente',
                        'nao_conhece',
                        'nao_util',
                        'ja_tentou',
                        'prefere_outros'
                    ].map((optionKey) => (
                        <Table.Column
                            title={t(`uso_praticas.opcoes.${optionKey}`)}
                            key={optionKey}
                            render={(text, record) => (
                                <Form.Item
                                    name={'uso_praticas_'+record.key}
                                    noStyle
                                    rules={[{ required: true, message: t('uso_praticas.required') }]}
                                >
                                    <Radio.Group>
                                        <Radio value={optionKey} />
                                    </Radio.Group>
                                </Form.Item>
                            )}
                        />
                    ))}
                </Table>
                )}
            </Card>
            <Card title={t('uso_ia_generativa')}>
                <Form.Item
                    name="areas_uso_ia"
                    label={(index++)+"-"+t('areas_uso_ia.label')}
                    rules={[{ required: true, message: t('areas_uso_ia.required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        <Checkbox value="ideias_criativas">{t('areas_uso_ia.options.ideias_criativas')}</Checkbox>
                        <Checkbox value="conteudo_visual_sonoro">{t('areas_uso_ia.options.conteudo_visual_sonoro')}</Checkbox>
                        <Checkbox value="implementacao">{t('areas_uso_ia.options.implementacao')}</Checkbox>
                        <Checkbox value="planejamento">{t('areas_uso_ia.options.planejamento')}</Checkbox>
                        <Checkbox value="testes">{t('areas_uso_ia.options.testes')}</Checkbox>
                        <Checkbox value="validacao">{t('areas_uso_ia.options.validacao')}</Checkbox>
                        <Checkbox value="curioso">{t('areas_uso_ia.options.curioso')}</Checkbox>
                        <Checkbox value="nao_usado">{t('areas_uso_ia.options.nao_usado')}</Checkbox>
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
                    label={(index++) + " - " + t('temores_uso_ia.label')}
                    rules={[{ required: true, message: t('temores_uso_ia.required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                            'dados_copyright',
                            'privacidade',
                            'substituicao',
                            'transparencia',
                            'originalidade',
                            'etica',
                            'outro',
                            'sem_preocupacoes'
                        ].map((value) => (
                            <Checkbox
                                key={value}
                                value={value}
                                disabled={
                                    selecteds["temores_uso_ia"]?.length >= 2 &&
                                    !selecteds["temores_uso_ia"].includes(value)
                                }
                            >
                                {t(`temores_uso_ia.options.${value}`)}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                {selecteds.temores_uso_ia?.includes('outro') && (
                    <Form.Item
                        name="temores_uso_ia_outro"
                        label={(index - 1) + "a - " + t('temores_uso_ia.outro_descreva')}
                        rules={[{ required: true, message: t('temores_uso_ia.outro_descreva') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Card>
            <Card title={t('desafios')}>
            <Collapse 
            {...(problemas_selected
                    ? { activeKey: ['tecnico'] }
                    : { defaultActiveKey: [] })}
                ghost={problemas_selected}>
            <Collapse.Panel header={!problemas_selected&&t("option_area")} showArrow={!problemas_selected} collapsible={problemas_selected&&"icon"} key="tecnico">
                <Form.Item
                    name="dificuldades_manutencao"
                    label={(index++) + '-' + t('dificuldades_manutencao.label')}
                    rules={[{ required: problemas_selected, message: t('dificuldades_manutencao.required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        {['codigo_dificil', 'mudancas_quebram', 'quebra_existente', 'teste_demorado', 'crescimento_ferramental', 'sem_dificuldades', 'outro'].map((value) => (
                            <Checkbox
                                key={value}
                                value={value}
                                disabled={
                                    selecteds["dificuldades_manutencao"]?.length >= 3 &&
                                    !selecteds["dificuldades_manutencao"].includes(value)
                                }
                            >
                                {t(`dificuldades_manutencao.options.${value}`)}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                {selecteds.dificuldades_manutencao?.includes('outro') && (
                    <Form.Item
                        name="dificuldades_manutencao_outro"
                        label={(index - 1) + 'a-' + t('dificuldades_manutencao.outro_descreva')}
                        rules={[{ required: true, message: t('dificuldades_manutencao.outro_descreva') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="causas_problemas_tecnicos"
                    label={(index++) + '-' + t('causas_problemas_tecnicos.label')}
                    rules={[{ required: problemas_selected, message: t('causas_problemas_tecnicos.required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                            'falta_tempo',
                            'codigo_desorganizado',
                            'comunicacao_dificil',
                            'sem_testes',
                            'mudancas_escopo',
                            'sem_ferramentas',
                            'outro'
                        ].map((value) => (
                            <Checkbox
                                key={value}
                                value={value}
                                disabled={
                                    selecteds["causas_problemas_tecnicos"]?.length >= 3 &&
                                    !selecteds["causas_problemas_tecnicos"].includes(value)
                                }
                            >
                                {t(`causas_problemas_tecnicos.options.${value}`)}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                {selecteds.causas_problemas_tecnicos?.includes('outro') && (
                    <Form.Item
                        name="causas_problemas_tecnicos_outro"
                        label={(index - 1) + 'a-' + t('causas_problemas_tecnicos.outro_descreva')}
                        rules={[{ required: true, message: t('causas_problemas_tecnicos.outro_descreva') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="desafios_testes"
                    label={(index++) + '-' + t('desafios_testes.label')}
                    rules={[{ required: problemas_selected, message: t('desafios_testes.required') }]}
                >
                    <Checkbox.Group  style={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                            'nao_testa',
                            'manual_demorado',
                            'manual_repetitivo',
                            'auto_dificil_aplicar',
                            'auto_incompleto',
                            'auto_desafios_complexos',
                            'sem_desafios'
                        ].map((value) => (
                            <Checkbox
                                key={value}
                                value={value}
                                disabled={
                                    selecteds["desafios_testes"]?.length >= 2 &&
                                    !selecteds["desafios_testes"].includes(value)
                                }
                            >
                                {t(`desafios_testes.options.${value}`)}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>
                </Collapse.Panel>
            </Collapse>
            </Card>
            <Card title={t("artistis_profile")}>
            <Collapse 
            {...(artist_selcted
                    ? { activeKey: ['artista'] }
                    : { defaultActiveKey: [] })} ghost={artist_selcted}>
            <Collapse.Panel header={!artist_selcted&&t("option_area")} 
                showArrow={!artist_selcted} 
                collapsible={artist_selcted&&"icon"} key="artista">

                <Form.Item
                    name="avaliacao_artefatos"
                    label={(index++) + " - " + t('avaliacao_artefatos.label')}
                    rules={[{ required: artist_selcted, message: t('avaliacao_artefatos.required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }} options={[
                        { value: 'criterios_definidos', label: t('avaliacao_artefatos.options.criterios_definidos') },
                        { value: 'avaliacao_subjetiva', label: t('avaliacao_artefatos.options.avaliacao_subjetiva') },
                        { value: 'testes_formais', label: t('avaliacao_artefatos.options.testes_formais') },
                        { value: 'avaliacao_por_outros', label: t('avaliacao_artefatos.options.avaliacao_por_outros') },
                        { value: 'sem_avaliacao_estruturada', label: t('avaliacao_artefatos.options.sem_avaliacao_estruturada') },
                        { value: 'outro', label: t('outro') },
                    ]} />
                </Form.Item>

                {selecteds['avaliacao_artefatos']?.includes('outro') && (
                    <Form.Item
                        name="avaliacao_artefatos_outro"
                        label={(index - 1) + "a - " + t('avaliacao_artefatos.outro_descricao')}
                        rules={[{ required: true, message: t('avaliacao_artefatos.outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="responsavel_validacao_artefatos"
                    label={(index++) + " - " + t('responsavel_validacao_artefatos.label')}
                    rules={[{ required: artist_selcted, message: t('responsavel_validacao_artefatos.required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }} options={[
                        { value: 'eu', label: t('responsavel_validacao_artefatos.options.eu') },
                        { value: 'qa', label: t('responsavel_validacao_artefatos.options.qa') },
                        { value: 'outros_membros', label: t('responsavel_validacao_artefatos.options.outros_membros') },
                        { value: 'usuarios', label: t('responsavel_validacao_artefatos.options.usuarios') },
                        { value: 'nao_testamos', label: t('responsavel_validacao_artefatos.options.nao_testamos') },
                        { value: 'outro', label: t('outro') },
                    ]} />
                </Form.Item>

                {selecteds['responsavel_validacao_artefatos']?.includes('outro') && (
                    <Form.Item
                        name="responsavel_validacao_artefatos_outro"
                        label={(index - 1) + "a - " + t('responsavel_validacao_artefatos.outro_descricao')}
                        rules={[{ required: true, message: t('responsavel_validacao_artefatos.outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="percepcao_avaliacao_artefatos"
                    label={(index++) + " - " + t('percepcao_avaliacao_artefatos')}
                >
                    <Input.TextArea autoSize={{ minRows: 3 }} />
                </Form.Item>


            </Collapse.Panel>
            </Collapse>
            </Card>



            <Card title={t("designer_profile")}>
            <Collapse {...(design_selected
                    ? { activeKey: ['designer'] }
                    : { defaultActiveKey: [] })} ghost={design_selected}>
            <Collapse.Panel header={!design_selected&&t("option_area")} 
                showArrow={!design_selected} 
                collapsible={design_selected&&"icon"} key="desiner">
                <Form.Item
                    name="design_modelagem"
                    label={(index++)+"-"+t('design_modelagem')}
                    rules={[{ required: design_selected, message: t('design_required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }} options={[
                        { value: 'uml', label: t('design_modelagem_options.uml') },
                        { value: 'prototipo_real', label: t('design_modelagem_options.prototipo_real') },
                        { value: 'prototipo_ferramenta', label: t('design_modelagem_options.prototipo_ferramenta') },
                        { value: 'anotacoes_simples', label: t('design_modelagem_options.anotacoes_simples') },
                        { value: 'mental', label: t('design_modelagem_options.mental') },
                        { value: 'outro', label: t('outro') },
                    ]} />
                </Form.Item>

                {selecteds['design_modelagem']?.includes('outro') && (
                    <Form.Item
                        name="design_modelagem_outro_descricao"
                        label={(index-1)+"a-"+t('design_modelagem_outro_descricao')}
                        rules={[{ required: true, message: t('design_outro_descricao_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="design_validacao"
                    label={(index++)+"-"+t('design_validacao')}
                    rules={[{ required: design_selected, message: t('design_required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}  options={[
                        { value: 'prototipo_simplificado', label: t('design_validacao_options.prototipo_simplificado') },
                        { value: 'prototipo_real', label: t('design_validacao_options.prototipo_real') },
                        { value: 'excel', label: t('design_validacao_options.excel') },
                        { value: 'machinations', label: t('design_validacao_options.machinations') },
                        { value: 'mental', label: t('design_validacao_options.mental') },
                        { value: 'outro', label: t('outro') },
                    ]} />
                </Form.Item>

                {selecteds['design_validacao']?.includes('outro') && (
                    <Form.Item
                        name="design_validacao_outro_descricao"
                        label={(index-1)+"a-"+t('design_validacao_outro_descricao')}
                        rules={[{ required: true, message: t('design_outro_descricao_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
                </Collapse.Panel>
            </Collapse>
            </Card>



            <Card title={t("tecnical_profile")}>
            <Collapse {...(tester_selected
                    ? { activeKey: ['tester'] }
                    : { defaultActiveKey: [] })} ghost={tester_selected}>
            <Collapse.Panel header={!tester_selected&&t("option_area")} 
                showArrow={!tester_selected} 
                collapsible={tester_selected&&"icon"} key="tester">
                <Form.Item
                    name="testes_jogo"
                    label={(index++)+"-"+t('testes_jogo')}
                    rules={[{ required: tester_selected, message: t('testes_jogo_required') }]}
                >
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}  options={[
                        { value: 'exploratorio', label: t('testes_jogo_options.exploratorio') },
                        { value: 'roteiro', label: t('testes_jogo_options.roteiro') },
                        { value: 'automatizado', label: t('testes_jogo_options.automatizado') },
                        { value: 'outro', label: t('outro') },
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
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}  options={[
                        { value: 'entendimento_frameworks', label: t('dificuldades_testes_options.entendimento_frameworks') },
                        { value: 'preferencia_humanos', label: t('dificuldades_testes_options.preferencia_humanos') },
                        { value: 'implementacao_dificil', label: t('dificuldades_testes_options.implementacao_dificil') },
                        { value: 'nao_encontram_erros_reais', label: t('dificuldades_testes_options.nao_encontram_erros_reais') },
                        { value: 'outro', label: t('outro') }
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
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}  options={[
                        { value: 'robotframework', label: t('ferramentas_teste_options.robotframework') },
                        { value: 'selenium', label: t('ferramentas_teste_options.selenium') },
                        { value: 'appium', label: t('ferramentas_teste_options.appium') },
                        { value: 'unity', label: t('ferramentas_teste_options.unity') },
                        { value: 'unreal_functional', label: t('ferramentas_teste_options.unreal_functional') },
                        { value: 'unreal_gauntlet', label: t('ferramentas_teste_options.unreal_gauntlet') },
                        { value: 'outro', label: t('outro') }
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
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}  options={[
                        { value: 'componentes', label: t('conteudo_testado_options.componentes') },
                        { value: 'performance', label: t('conteudo_testado_options.performance') },
                        { value: 'cenarios', label: t('conteudo_testado_options.cenarios') },
                        { value: 'acoes_personagem', label: t('conteudo_testado_options.acoes_personagem') },
                        { value: 'teste_fumaca', label: t('conteudo_testado_options.teste_fumaca') },
                        { value: 'outro', label: t('outro') }
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
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}  options={[
                        { value: 'antes_funcionalidade', label: t('etapa_testes_options.antes_funcionalidade') },
                        { value: 'durante_funcionalidade', label: t('etapa_testes_options.durante_funcionalidade') },
                        { value: 'pos_prototipo', label: t('etapa_testes_options.pos_prototipo') },
                        { value: 'pos_funcionalidades', label: t('etapa_testes_options.pos_funcionalidades') },
                        { value: 'no_fim', label: t('etapa_testes_options.no_fim') },
                        { value: 'quando_possivel', label: t('etapa_testes_options.quando_possivel') },
                        { value: 'outro', label: t('outro') }
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
                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}  options={[
                        { value: 'nao', label: t('uso_testes_options.nao') },
                        { value: 'atualizacao', label: t('uso_testes_options.atualizacao') },
                        { value: 'proxima_fase', label: t('uso_testes_options.proxima_fase') },
                        { value: 'nova_funcionalidade', label: t('uso_testes_options.nova_funcionalidade') },
                        { value: 'outro', label: t('outro') }
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
                </Collapse.Panel>
            </Collapse>
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
