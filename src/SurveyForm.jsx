import React, { useState,useEffect,useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Collapse, Table, Typography, Card, FloatButton, Popconfirm, Form, Input, Button, Checkbox, Select, Radio, InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import RequiredFieldsSummary from "./RequiredFieldsSummary.jsx";
import {getCountryOptions} from "./utils.jsx";
import {debounce, isEqual} from 'lodash';



const SurveyForm = ({ data, setData, uiid, onAnswer,onReset }) => {
    const [form] = Form.useForm();
    const screens = Grid.useBreakpoint();
    const [currentScreen, setCurrentScreen] = useState(screens);
    const { t, i18n } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [requiredErrors, setRequiredErrors] = useState([]);

    //initial data
    useEffect(() => {
        form.setFieldsValue(data);
    }, [])
    //changeData
    const debouncedSetData = useCallback(
        debounce((allValues) => {
            setData(prev => {
                if (isEqual(prev, allValues)) return prev;
                return allValues;
            });
        }, 300),
        []
    );
    useEffect(() => {
        if (!isEqual(currentScreen, screens)) {
            setCurrentScreen(screens);
        }
    }, [screens]);




    //seletores
    const artist_selected = useMemo(() =>
            ["artista", "artista_som", "roteiro_narrativa", "design_ux"].some(role =>
                data.papel?.includes(role)
            ),
        [data.papel]
    );
    const design_selected = useMemo(() =>
            ["game_designer", "level_designer"].some(role =>
                data.papel?.includes(role)
            ),
        [data.papel]
    );
    const tester_selected = useMemo(() =>
            ["programador", "qa"].some(role =>
                data.papel?.includes(role)
            ),
        [data.papel]
    );
    const problemas_selected = useMemo(() =>
            ["gerente", "programador", "qa"].some(role =>
                data.papel?.includes(role)
            ),
        [data.papel]
    );

    //opcoes
    const desafios_teste = [
        'nao_testa',
        'manual_demorado',
        'manual_repetitivo',
        'auto_dificil_aplicar',
        'auto_incompleto',
        'auto_desafios_complexos',
        'sem_desafios'
    ];

    const praticas = ['controle_versao',
        'padroes_design',
        'modelagem_projeto',
        'prototipacao',
        'tdd',
        'integracao_continua'];
    const problemas_praticas = [
        'uso_atualmente',
        'nao_conhece',
        'nao_util',
        'ja_tentou',
        'prefere_outros'
    ];
    const problemas_ia = [
        'dados_copyright',
        'privacidade',
        'substituicao',
        'transparencia',
        'originalidade',
        'etica',
        'outro',
        'sem_preocupacoes'
    ];
    const problemas_manutencao = ['codigo_dificil', 'mudancas_quebram', 'quebra_existente', 'teste_demorado',
        'crescimento_ferramental', 'sem_dificuldades'];
    const problemas_causas = [
        'falta_tempo',
        'codigo_desorganizado',
        'comunicacao_dificil',
        'sem_testes',
        'mudancas_escopo',
        'sem_ferramentas',
        'outro'
    ];

    const isMissing = useMemo(() => {
        return praticas.reduce((acc, pratica) => {
            acc[pratica] = requiredErrors.includes("uso_praticas_" + pratica);
            return acc;
        }, {});
    }, [requiredErrors]);

    const onFinish = async (values) => {
        setLoading(true)
        const dataCollums = ["uid","language",
            //Perfil e Contexto Profissional
            "year_of_birth","country_work","formacao",'area_formacao','area_formacao_outro','anos_experiencia',
            'qtd_projetos',"situacao","situacao_equipe","duracao_projetos","funcoes","foncoes_outro","tipos_jogos",
            "tipos_jogos_outro","plataformas_desenvolvimento", "plataformas_outro",'ferramentas_desenvolvimento',
            "ferramentas_outro","uso_praticas_controle_versao", "uso_praticas_padroes_design",
            "uso_praticas_modelagem_projeto", "uso_praticas_prototipacao", "uso_praticas_tdd",
            "uso_praticas_integracao_continua","dificuldades_manutencao","dificuldades_manutencao_outro"
        ]
        const dataCollums_old = ['uid',"language","language_form",

            'where_from','how_old','formacao','area_formacao',
            'area_formacao_outro','anos_experiencia', 'qtd_projetos', 'situacao','tamanho_maior_time',
            "duracao_media_projetos",

            'papel','papel_outro',"tipos_jogos","tipos_jogos_outro_descricao","plataformas_desenvolvimento",
            "plataformas_outro_descricao",'ferramentas_desenvolvimento', "ferramentas_outro_descricao",
            "uso_praticas_controle_versao","uso_praticas_padroes_design","uso_praticas_modelagem_projeto",
            "uso_praticas_prototipacao", "uso_praticas_tdd", "uso_praticas_integracao_continua","dificuldade_adocao_praticas",
            
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
                title={t('survey.floatmenu.confirmReset')}
                description={t('survey.floatmenu.confirmResetDescription')}
                onConfirm={onReset}
                okText={t('survey.common.sim')}
                cancelText={t('survey.common.nao')}
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
                debouncedSetData(all);
            }}
            onFinishFailed={({ errorFields }) => {
                const newErrors = errorFields.map(f => f.name.join('.'));
                setRequiredErrors(prev => {
                    if (isEqual(prev, newErrors)) return prev;
                    return newErrors;
                });
            }}
            form={form} layout="vertical" onFinish={onFinish}
        >
            <Form.Item name="uid" initialValue={uiid} hidden>
                <Input value={uiid} type="hidden" />
            </Form.Item>
            <Form.Item name="language" initialValue={i18n.languages[0]} hidden>
                <Input value={i18n.languages[0]} type="hidden" />
            </Form.Item>
            <Form.Item name="language_form" initialValue={i18n.language} hidden>
                <Input value={i18n.language} type="hidden" />
            </Form.Item>

            <Card  title={t("survey.personal_context.header")} >
                <Form.Item name="year_of_birth" label={(index++)+"-"+t('survey.personal_context.year_of_birth')} >
                    <InputNumber />
                </Form.Item>
                <Form.Item name="country_work" label={(index++)+"-"+t('survey.personal_context.country_work')} >
                    <Select
                        showSearch
                        options={getCountryOptions(i18n.languages)}
                        filterOption={(input, option) =>
                            option?.label?.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item name="formacao" label={(index++)+"-"+t('survey.personal_context.formacao')} rules={[{ required: true, message: t('survey.common.required_option') }]}>
                   <Radio.Group className="flex-column" >
                    <Radio value="nenhum">{t('survey.personal_context.formacao_opcoes.none')}</Radio>
                    <Radio value="fundamental">{t('survey.personal_context.formacao_opcoes.fundamental')}</Radio>
                    <Radio value="medio">{t('survey.personal_context.formacao_opcoes.medio')}</Radio>
                    <Radio value="graduacao">{t('survey.personal_context.formacao_opcoes.graduacao')}</Radio>
                    <Radio value="especializacao">{t('survey.personal_context.formacao_opcoes.especializacao')}</Radio>
                    <Radio value="mestrado">{t('survey.personal_context.formacao_opcoes.mestrado')}</Radio>
                    <Radio value="doutorado">{t('survey.personal_context.formacao_opcoes.doutorado')}</Radio>
                </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="area_formacao"
                    label={(index++)+"-"+t('survey.personal_context.area_formacao')}
                    rules={[{ required: true, message: t('survey.common.required_option') }]}
                >
                    <Radio.Group className="flex-column" >
                        <Radio value="computacao">{t('survey.personal_context.area_formacao_o.computacao')}</Radio>
                        <Radio value="engenharia">{t('survey.personal_context.area_formacao_o.engenharia')}</Radio>
                        <Radio value="jogos">{t('survey.personal_context.area_formacao_o.jogos')}</Radio>
                        <Radio value="design">{t('survey.personal_context.area_formacao_o.design')}</Radio>
                        <Radio value="musica">{t('survey.personal_context.area_formacao_o.musica')}</Radio>
                        <Radio value="comunicacao">{t('survey.personal_context.area_formacao_o.comunicacao')}</Radio>
                        <Radio value="autodidata">{t('survey.personal_context.area_formacao_o.autodidata')}</Radio>
                        <Radio value="outro">{t('survey.common.outra')}</Radio>
                    </Radio.Group>
                </Form.Item>

                {data['area_formacao']=='outro' && (
                    <Form.Item
                    name="area_formacao_outro"
                    label={(index-1)+"a-"+t('survey.common.outra_describe')}
                    rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                    <Input />
                    </Form.Item>
                )}
                <Form.Item name="anos_experiencia" label={(index++)+"-"+t('survey.personal_context.anos_experiencia')} rules={[{ required: true, message: t('survey.common.required_describe')  }]}>
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item name="qtd_projetos" label={(index++)+"-"+t('survey.personal_context.qtd_projetos')} rules={[{ required: true, message: t('survey.common.required_describe')  }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item
                    name="situacao"
                    label={(index++)+"-"+t('survey.personal_context.situacao')}
                    rules={[{ required: true, message: t('survey.common.required_option') }]}
                >
                    <Radio.Group className="flex-column" >
                        <Radio value="atuacao_industria_integral">
                            {t('survey.personal_context.situacao_o.atuacao_industria_integral')}
                        </Radio>
                        <Radio value="atuacao_industria_parcial">
                            {t('survey.personal_context.situacao_o.atuacao_industria_parcial')}
                        </Radio>
                        <Radio value="atuacao_freelancer">
                            {t('survey.personal_context.situacao_o.atuacao_freelancer')}
                        </Radio>
                        <Radio value="atuacao_indie_horas_vagas">
                            {t('survey.personal_context.situacao_o.atuacao_indie_horas_vagas')}
                        </Radio>
                        <Radio value="atuacao_eventual">
                            {t('survey.personal_context.situacao_o.atuacao_eventual')}
                        </Radio>
                        <Radio value="atuacao_nao_envolvido">
                            {t('survey.personal_context.situacao_o.atuacao_nao_envolvido')}
                        </Radio>
                    </Radio.Group>
                </Form.Item>


                <Form.Item name="situacao_equipe" label={(index++)+"-"+t('survey.personal_context.situacao_equipe')} rules={[{ required: true, message: t('survey.common.required_option')  }]}>
                    <Radio.Group className="flex-column" >
                        <Radio value="individual">{t('survey.personal_context.situacao_equipe_o.individual')}</Radio>
                        <Radio value="pequena">{t('survey.personal_context.situacao_equipe_o.pequena')}</Radio>
                        <Radio value="media">{t('survey.personal_context.situacao_equipe_o.media')}</Radio>
                        <Radio value="grande">{t('survey.personal_context.situacao_equipe_o.grande')}</Radio>
                        <Radio value="varia">{t('survey.personal_context.situacao_equipe_o.varia')}</Radio>
                        <Radio value="nao_participa">{t('survey.personal_context.situacao_equipe_o.nao_participa')}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="duracao_projetos" label={(index++) + '-' + t('survey.personal_context.duracao_projetos')} rules={[{ required: true, message: t('survey.common.required_option')  }]}>
                    <Radio.Group className="flex-column" >
                        <Radio value="menos_1_mes">{t('survey.personal_context.duracao_projetos_o.menos_1_mes')}</Radio>
                        <Radio value="1a3_meses">{t('survey.personal_context.duracao_projetos_o.1a3_meses')}</Radio>
                        <Radio value="4a6_meses">{t('survey.personal_context.duracao_projetos_o.4a6_meses')}</Radio>
                        <Radio value="7a12_meses">{t('survey.personal_context.duracao_projetos_o.7a12_meses')}</Radio>
                        <Radio value="mais_1_ano">{t('survey.personal_context.duracao_projetos_o.mais_1_ano')}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="funcoes"
                    label={(index++)+"-"+t('survey.personal_context.funcoes')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column" >
                        <Checkbox value="gerente">{t('survey.personal_context.funcoes_o.gerente')}</Checkbox>
                        <Checkbox value="programador">{t('survey.personal_context.funcoes_o.programador')}</Checkbox>
                        <Checkbox value="artista">{t('survey.personal_context.funcoes_o.artista')}</Checkbox>
                        <Checkbox value="animacao">{t('survey.personal_context.funcoes_o.animacao')}</Checkbox>
                        <Checkbox value="design_ux">{t('survey.personal_context.funcoes_o.design_ux')}</Checkbox>
                        <Checkbox value="game_designer">{t('survey.personal_context.funcoes_o.game_designer')}</Checkbox>
                        <Checkbox value="level_designer">{t('survey.personal_context.funcoes_o.level_designer')}</Checkbox>
                        <Checkbox value="qa">{t('survey.personal_context.funcoes_o.qa')}</Checkbox>
                        <Checkbox value="artista_som">{t('survey.personal_context.funcoes_o.artista_som')}</Checkbox>
                        <Checkbox value="roteiro_narrativa">{t('survey.personal_context.funcoes_o.roteiro_narrativa')}</Checkbox>
                        <Checkbox value="marketing">{t('survey.personal_context.funcoes_o.marketing')}</Checkbox>
                        <Checkbox value="outro">{t('survey.common.outro')}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                {data['funcoes']?.includes('outro') && (
                    <Form.Item
                        name="foncoes_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="tipos_jogos"
                    label={(index++)+"-"+t('survey.personal_context.tipos_jogos')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column"  options={[
                        { label: t('survey.personal_context.tipos_jogos_options.fps'), value: 'fps' },
                        { label: t('survey.personal_context.tipos_jogos_options.educacional'), value: 'educacional' },
                        { label: t('survey.personal_context.tipos_jogos_options.rpg'), value: 'rpg' },
                        { label: t('survey.personal_context.tipos_jogos_options.aventura_narrativa'), value: 'aventura_narrativa' },
                        { label: t('survey.personal_context.tipos_jogos_options.2d'), value: '2d' },
                        { label: t('survey.personal_context.tipos_jogos_options.3d'), value: '3d' },
                        { label: t('survey.personal_context.tipos_jogos_options.plataforma'), value: 'plataforma' },
                        { label: t('survey.personal_context.tipos_jogos_options.boardgame'), value: 'boardgame' },
                        { label: t('survey.personal_context.tipos_jogos_options.puzzle'), value: 'puzzle' },
                        { label: t('survey.personal_context.tipos_jogos_options.simulacao'), value: 'simulacao' },
                        { label: t('survey.personal_context.tipos_jogos_options.manager'), value: 'manager' },
                        { label: t('survey.common.outro'), value: 'outro' },
                    ]} />
                </Form.Item>
                {data['tipos_jogos']?.includes('outro') && (
                    <Form.Item
                        name="tipos_jogos_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="plataformas_desenvolvimento"
                    label={(index++) + '-' + t('survey.personal_context.plataformas_desenvolvimento')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group
                        className="flex-column"
                        options={[
                            { label: t('survey.personal_context.plataformas_desenvolvimento_o.pc'), value: 'pc' },
                            { label: t('survey.personal_context.plataformas_desenvolvimento_o.web'), value: 'web' },
                            { label: t('survey.personal_context.plataformas_desenvolvimento_o.mobile'), value: 'mobile' },
                            { label: t('survey.personal_context.plataformas_desenvolvimento_o.console'), value: 'console' },
                            { label: t('survey.personal_context.plataformas_desenvolvimento_o.xr'), value: 'xr' },
                            { label: t('survey.common.outra'), value: 'outro' },
                        ]}
                    />
                </Form.Item>


                {data['plataformas_desenvolvimento']?.includes('outro') && (
                    <Form.Item
                        name="plataformas_outro"
                        label={(index-1)+"a-"+t('survey.common.outra_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}


                <Form.Item
                    name="ferramentas_desenvolvimento"
                    label={(index++) + '-' + t('survey.personal_context.ferramentas_desenvolvimento')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group
                        className="flex-column"
                        options={[
                            { value: 'unity', label: t('survey.personal_context.ferramentas_desenvolvimento_options.unity') },
                            { value: 'unreal', label: t('survey.personal_context.ferramentas_desenvolvimento_options.unreal') },
                            { value: 'godot', label: t('survey.personal_context.ferramentas_desenvolvimento_options.godot') },
                            { value: 'gamemaker', label: t('survey.personal_context.ferramentas_desenvolvimento_options.gamemaker') },
                            { value: 'rpgmaker', label: t('survey.personal_context.ferramentas_desenvolvimento_options.rpgmaker') },
                            { value: 'propria_pessoal', label: t('survey.personal_context.ferramentas_desenvolvimento_options.propria_pessoal') },
                            { value: 'propria_corporativa', label: t('survey.personal_context.ferramentas_desenvolvimento_options.propria_corporativa') },
                            { value: 'framework_baixo_nivel', label: t('survey.personal_context.ferramentas_desenvolvimento_options.framework_baixo_nivel') },
                            { value: 'nada', label: t('survey.personal_context.ferramentas_desenvolvimento_options.nada') },
                            { value: 'outro', label: t('survey.common.outra') },
                        ]}
                    />
                </Form.Item>


                {data['ferramentas_desenvolvimento']?.includes('outro') && (
                    <Form.Item
                        name="ferramentas_outro"
                        label={(index-1)+"a-"+t('survey.common.outra_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}


            </Card>

            <Card title={t('survey.software_engeniring.header')}>
                <Typography.Title level={5}>
                    <span className="required-extra">* </span>
                    {(index++) + ' - ' + t('survey.software_engeniring.uso_praticas.label')}
                </Typography.Title>
                {currentScreen.xs ? (
                  praticas.map((key) => (
                    <Card key={key} style={{ marginBottom: 12 }}>
                      <Typography.Text strong>{t(`survey.software_engeniring.uso_praticas.${key}`)}</Typography.Text>
                      <Form.Item
                        name={'uso_praticas_'+key}
                        rules={[{ required: true, message: t('survey.common.required_option') }]}
                      >
                        <Radio.Group>
                          {problemas_praticas.map((optionKey) => (
                            <Radio  key={key+"_"+optionKey} value={optionKey}>{t(`survey.software_engeniring.uso_praticas.opcoes.${optionKey}`)}</Radio>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    </Card>
                  ))
                ) : (
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th></th>
                        {problemas_praticas.map((optionKey) => (
                            <th key={optionKey}>{t(`survey.software_engeniring.uso_praticas.opcoes.${optionKey}`)}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {praticas.map((key) => (
                        <Form.Item
                            name={`uso_praticas_${key}`}
                            noStyle
                            key={key}
                            rules={[{ required: true, message: t('survey.common.required_option') }]}
                        >

                            <tr key={key} className={isMissing[key] ? 'highlight-missing' : ''}>
                                <td>{t(`survey.software_engeniring.uso_praticas.${key}`)}</td>
                                {problemas_praticas.map((optionKey) => (
                                    <td align="center" key={optionKey}>
                                        <Radio checked={data[`uso_praticas_${key}`]===optionKey} value={optionKey} />
                                    </td>
                                ))}
                            </tr>

                        </Form.Item>
                    ))}

                    </tbody>
                </table>
                )}
                <br/>

                <Form.Item
                    name="dificuldades_manutencao"
                    label={(index++) + '-' + t('survey.software_engeniring.dificuldades_manutencao')}
                    rules={[{ required: problemas_selected, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column" >
                        {problemas_manutencao.map((value) => (
                            <Checkbox
                                key={value}
                                value={value}
                                disabled={
                                    data["dificuldades_manutencao"]?.length >= 3 &&
                                    !data["dificuldades_manutencao"].includes(value)
                                }
                            >
                                {t(`survey.software_engeniring.dificuldades_manutencao_o.${value}`)}
                            </Checkbox>
                        ))}
                        <Checkbox
                            key="outro"
                            value="outro"
                            disabled={
                                data["dificuldades_manutencao"]?.length >= 3 &&
                                !data["dificuldades_manutencao"].includes("outro")
                            }
                        >
                            {t('survey.common.outro')}
                        </Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {data.dificuldades_manutencao?.includes('outro') && (
                    <Form.Item
                        name="dificuldades_manutencao_outro"
                        label={(index - 1) + 'a-' + t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="causas_problemas_tecnicos"
                    label={(index++) + '-' + t('causas_problemas_tecnicos')}
                    rules={[{ required: problemas_selected, message: t('causas_problemas_tecnicos_o.required') }]}
                >
                    <Checkbox.Group className="flex-column" >
                        {problemas_causas.map((value) => (
                            <Checkbox
                                key={value}
                                value={value}
                                disabled={
                                    data["causas_problemas_tecnicos"]?.length >= 3 &&
                                    !data["causas_problemas_tecnicos"].includes(value)
                                }
                            >
                                {t(`causas_problemas_tecnicos_o.options.${value}`)}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                {data.causas_problemas_tecnicos?.includes('outro') && (
                    <Form.Item
                        name="causas_problemas_tecnicos_outro"
                        label={(index - 1) + 'a-' + t('causas_problemas_tecnicos_outro')}
                        rules={[{ required: true, message: t('outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="desafios_testes"
                    label={(index++) + '-' + t('desafios_testes')}
                    rules={[{ required: problemas_selected, message: t('desafios_testes_o.required') }]}
                >
                    <Checkbox.Group  className="flex-column" >
                        {desafios_teste.map((value) => (
                            <Checkbox
                                key={value}
                                value={value}
                                disabled={
                                    data["desafios_testes"]?.length >= 2 &&
                                    !data["desafios_testes"].includes(value)
                                }
                            >
                                {t(`desafios_testes_o.options.${value}`)}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>
            </Card>
            <Card title={t('uso_ia_generativa')}>
                <Form.Item
                    name="areas_uso_ia"
                    label={(index++)+"-"+t('areas_uso_ia')}
                    rules={[{ required: true, message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column" >
                        <Checkbox value="ideias_criativas">{t('areas_uso_ia_o.options.ideias_criativas')}</Checkbox>
                        <Checkbox value="conteudo_visual_sonoro">{t('areas_uso_ia_o.options.conteudo_visual_sonoro')}</Checkbox>
                        <Checkbox value="implementacao">{t('areas_uso_ia_o.options.implementacao')}</Checkbox>
                        <Checkbox value="planejamento">{t('areas_uso_ia_o.options.planejamento')}</Checkbox>
                        <Checkbox value="testes">{t('areas_uso_ia_o.options.testes')}</Checkbox>
                        <Checkbox value="validacao">{t('areas_uso_ia_o.options.validacao')}</Checkbox>
                        <Checkbox value="outro">{t('areas_uso_ia_o.options.outro')}</Checkbox>
                        <Checkbox value="ainda_nao_usei">{t('areas_uso_ia_o.options.ainda_nao_usei')}</Checkbox>
                        <Checkbox value="nao_usado">{t('areas_uso_ia_o.options.nao_usado')}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {data.areas_uso_ia?.includes('outro') && (
                    <Form.Item
                        name="areas_uso_ia_outro"
                        label={(index-1)+"a-"+t('areas_uso_ia_outro')}
                        rules={[{ required: true, message: t('outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="temores_uso_ia"
                    label={(index++) + " - " + t('temores_uso_ia')}
                    rules={[{ required: true, message: t('temores_uso_ia_o.required') }]}
                >
                    <Checkbox.Group className="flex-column" >
                        {problemas_ia.map((value) => (
                            <Checkbox
                                key={value}
                                value={value}
                                disabled={
                                    data["temores_uso_ia"]?.length >= 2 &&
                                    !data["temores_uso_ia"].includes(value)
                                }
                            >
                                {t(`temores_uso_ia_o.options.${value}`)}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                {data.temores_uso_ia?.includes('outro') && (
                    <Form.Item
                        name="temores_uso_ia_outro"
                        label={(index - 1) + "a - " + t('temores_uso_ia_outro')}
                        rules={[{ required: true, message: t('outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Card>

            <Card title={t("artistis_profile")}>
            <Collapse 
            {...(artist_selected
                    ? { activeKey: ['artista'] }
                    : { defaultActiveKey: [] })} ghost={artist_selected}>
            <Collapse.Panel header={!artist_selected&&t("option_area")} 
                showArrow={!artist_selected} 
                collapsible={artist_selected&&"icon"} key="artista">

                <Form.Item
                    name="avaliacao_artefatos"
                    label={(index++) + " - " + t('avaliacao_artefatos')}
                    rules={[{ required: artist_selected, message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column"  options={[
                        { value: 'criterios_definidos', label: t('avaliacao_artefatos_o.options.criterios_definidos') },
                        { value: 'avaliacao_subjetiva', label: t('avaliacao_artefatos_o.options.avaliacao_subjetiva') },
                        { value: 'testes_formais', label: t('avaliacao_artefatos_o.options.testes_formais') },
                        { value: 'avaliacao_por_outros', label: t('avaliacao_artefatos_o.options.avaliacao_por_outros') },
                        { value: 'sem_avaliacao_estruturada', label: t('avaliacao_artefatos_o.options.sem_avaliacao_estruturada') },
                        { value: 'outro', label: t('outro') },
                    ]} />
                </Form.Item>

                {data['avaliacao_artefatos']?.includes('outro') && (
                    <Form.Item
                        name="avaliacao_artefatos_outro"
                        label={(index - 1) + "a - " + t('avaliacao_artefatos_outro')}
                        rules={[{ required: true, message: t('avaliacao_artefatos_o.outro_required') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="responsavel_validacao_artefatos"
                    label={(index++) + " - " + t('responsavel_validacao_artefatos')}
                    rules={[{ required: artist_selected, message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column"  options={[
                        { value: 'eu', label: t('responsavel_validacao_artefatos_o.options.eu') },
                        { value: 'qa', label: t('responsavel_validacao_artefatos_o.options.qa') },
                        { value: 'outros_membros', label: t('responsavel_validacao_artefatos_o.options.outros_membros') },
                        { value: 'usuarios', label: t('responsavel_validacao_artefatos_o.options.usuarios') },
                        { value: 'nao_testamos', label: t('responsavel_validacao_artefatos_o.options.nao_testamos') },
                        { value: 'outro', label: t('outro') },
                    ]} />
                </Form.Item>

                {data['responsavel_validacao_artefatos']?.includes('outro') && (
                    <Form.Item
                        name="responsavel_validacao_artefatos_outro"
                        label={(index - 1) + "a - " + t('responsavel_validacao_artefatos_outro')}
                        rules={[{ required: true, message: t('responsavel_validacao_artefatos_o.outro_required') }]}
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
                collapsible={design_selected&&"icon"} key="designer">
                <Form.Item
                    name="design_modelagem"
                    label={(index++)+"-"+t('design_modelagem')}
                    rules={[{ required: design_selected, message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column"  options={[
                        { value: 'uml', label: t('design_modelagem_options.uml') },
                        { value: 'prototipo_real', label: t('design_modelagem_options.prototipo_real') },
                        { value: 'prototipo_ferramenta', label: t('design_modelagem_options.prototipo_ferramenta') },
                        { value: 'anotacoes_simples', label: t('design_modelagem_options.anotacoes_simples') },
                        { value: 'mental', label: t('design_modelagem_options.mental') },
                        { value: 'outro', label: t('outro') },
                    ]} />
                </Form.Item>

                {data['design_modelagem']?.includes('outro') && (
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
                    rules={[{ required: design_selected, message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'prototipo_simplificado', label: t('design_validacao_options.prototipo_simplificado') },
                        { value: 'prototipo_real', label: t('design_validacao_options.prototipo_real') },
                        { value: 'excel', label: t('design_validacao_options.excel') },
                        { value: 'machinations', label: t('design_validacao_options.machinations') },
                        { value: 'mental', label: t('design_validacao_options.mental') },
                        { value: 'outro', label: t('outro') },
                    ]} />
                </Form.Item>

                {data['design_validacao']?.includes('outro') && (
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
                    rules={[{ required: tester_selected, message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'exploratorio', label: t('testes_jogo_options.exploratorio') },
                        { value: 'roteiro', label: t('testes_jogo_options.roteiro') },
                        { value: 'automatizado', label: t('testes_jogo_options.automatizado') },
                        { value: 'outro', label: t('outro') },
                    ]} />
                </Form.Item>

                {data['testes_jogo']?.includes('outro') && (
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
                    rules={[{ required: tester_selected, message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'entendimento_frameworks', label: t('dificuldades_testes_options.entendimento_frameworks') },
                        { value: 'preferencia_humanos', label: t('dificuldades_testes_options.preferencia_humanos') },
                        { value: 'implementacao_dificil', label: t('dificuldades_testes_options.implementacao_dificil') },
                        { value: 'nao_encontram_erros_reais', label: t('dificuldades_testes_options.nao_encontram_erros_reais') },
                        { value: 'outro', label: t('outro') }
                    ]} />
                </Form.Item>

                {data['dificuldades_testes']?.includes('outro') && (
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
                    rules={[{ required: data['testes_jogo']?.includes('automatizado'), message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'robotframework', label: t('ferramentas_teste_options.robotframework') },
                        { value: 'selenium', label: t('ferramentas_teste_options.selenium') },
                        { value: 'appium', label: t('ferramentas_teste_options.appium') },
                        { value: 'unity', label: t('ferramentas_teste_options.unity') },
                        { value: 'unreal_functional', label: t('ferramentas_teste_options.unreal_functional') },
                        { value: 'unreal_gauntlet', label: t('ferramentas_teste_options.unreal_gauntlet') },
                        { value: 'outro', label: t('outro') }
                    ]} />
                </Form.Item>

                {data['ferramentas_teste']?.includes('outro') && (
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
                    rules={[{ required: data['testes_jogo']?.includes('automatizado'), message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'componentes', label: t('conteudo_testado_options.componentes') },
                        { value: 'performance', label: t('conteudo_testado_options.performance') },
                        { value: 'cenarios', label: t('conteudo_testado_options.cenarios') },
                        { value: 'acoes_personagem', label: t('conteudo_testado_options.acoes_personagem') },
                        { value: 'teste_fumaca', label: t('conteudo_testado_options.teste_fumaca') },
                        { value: 'outro', label: t('outro') }
                    ]} />
                </Form.Item>

                {data['conteudo_testado']?.includes('outro') && (
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
                    rules={[{ required: data['testes_jogo']?.includes('automatizado'), message: t('option_required') }]}
                >
                    <Radio.Group className="flex-column"   options={[
                        { value: 'antes_funcionalidade', label: t('etapa_testes_options.antes_funcionalidade') },
                        { value: 'durante_funcionalidade', label: t('etapa_testes_options.durante_funcionalidade') },
                        { value: 'pos_prototipo', label: t('etapa_testes_options.pos_prototipo') },
                        { value: 'pos_funcionalidades', label: t('etapa_testes_options.pos_funcionalidades') },
                        { value: 'no_fim', label: t('etapa_testes_options.no_fim') },
                        { value: 'quando_possivel', label: t('etapa_testes_options.quando_possivel') },
                        { value: 'outro', label: t('outro') }
                    ]} />
                </Form.Item>

                {data['etapa_testes']?.includes('outro') && (
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
                    rules={[{ required: data['testes_jogo']?.includes('automatizado'), message: t('option_required') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'nao', label: t('uso_testes_options.nao') },
                        { value: 'atualizacao', label: t('uso_testes_options.atualizacao') },
                        { value: 'proxima_fase', label: t('uso_testes_options.proxima_fase') },
                        { value: 'nova_funcionalidade', label: t('uso_testes_options.nova_funcionalidade') },
                        { value: 'outro', label: t('outro') }
                    ]} />
                </Form.Item>

                {data['uso_testes']?.includes('outro') && (
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

            <Form.Item name="contato_entrevista" label={(index++)+"-"+t('contato_entrevista')} rules={[{ required: true, message: t('option_required')  }]}>
                <Radio.Group>
                    <Radio value="sim">{t('survey.common.sim')}</Radio>
                    <Radio value="nao">{t('survey.common.nao')}</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="email" rules={[{required:data["contato_entrevista"]==="sim", message: t('email_required')}]}
                       label={(index++)+"-"+
                           (data["contato_entrevista"]==="sim"?t('email'):t('email_contato'))}>
                <Input type="email" />
            </Form.Item>
            </Card>
            <RequiredFieldsSummary
                missingFields={requiredErrors}
            />

            <Form.Item>
                <Button loading={loading} type="primary" block htmlType="submit">{t('enviar')}</Button>
            </Form.Item>

        </Form>
        </Card>
    );
};

export default SurveyForm;
