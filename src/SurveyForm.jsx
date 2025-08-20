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
                data.funcoes?.includes(role)
            ),
        [data.funcoes]
    );
    const design_selected = useMemo(() =>
            ["game_designer", "level_designer"].some(role =>
                data.funcoes?.includes(role)
            ),
        [data.funcoes]
    );
    const tester_selected = useMemo(() =>
            ["programador", "qa"].some(role =>
                data.funcoes?.includes(role)
            ),
        [data.funcoes]
    );
    const problemas_selected = useMemo(() =>
            ["gerente", "programador", "qa"].some(role =>
                data.funcoes?.includes(role)
            ),
        [data.funcoes]
    );


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
        'sem_preocupacoes'
    ];
    const problemas_manutencao = ['codigo_dificil', 'mudancas_quebram', 'comunicacao_dificil', 'prazo_curto',
        'mudancas_escopo','sem_boas_praticas', 'sem_dificuldades'];


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
            "tipos_jogos_outro","plataformas_desenvolvimento", "plataformas_desenvolvimento_outro",
            'ferramentas_desenvolvimento', "ferramentas_desenvolvimento_outro",

            //Praticas de Engenharia e teste
            "uso_praticas_controle_versao", "uso_praticas_padroes_design",
            "uso_praticas_modelagem_projeto", "uso_praticas_prototipacao", "uso_praticas_tdd",
            "uso_praticas_integracao_continua","dificuldades_manutencao","dificuldades_manutencao_outro","testes_jogo",
            "testes_jogo_outro","dificuldades_testes","dificuldades_testes_outro","ferramentas_teste",
            "ferramentas_teste_outro","conteudo_testado","conteudo_testado_outro","etapa_testes","etapa_testes_outro",
            "requisito_testes","requisito_testes_outro",

            //Desiner
            "avaliacao_artefatos","avaliacao_artefatos_outro","design_validacao","design_validacao_outro",

            //IA
            "areas_uso_ia","areas_uso_ia_outro","percepcao_uso_ia","percepcao_uso_ia_outro",

            //Consideracao final
            "consideracoes_finais",'contato_entrevista',"email"

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

            <Card  title={t("survey.personal_context")} >
                <Form.Item name="year_of_birth" label={(index++)+"-"+t('survey.year_of_birth')} >
                    <InputNumber />
                </Form.Item>
                <Form.Item name="country_work" label={(index++)+"-"+t('survey.country_work')} >
                    <Select
                        showSearch
                        options={getCountryOptions(i18n.languages)}
                        filterOption={(input, option) =>
                            option?.label?.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item name="formacao" label={(index++)+"-"+t('survey.formacao')} rules={[{ required: true, message: t('survey.common.required_option') }]}>
                   <Radio.Group className="flex-column" >
                    <Radio value="nenhum">{t('survey.formacao_opcoes.none')}</Radio>
                    <Radio value="fundamental">{t('survey.formacao_opcoes.fundamental')}</Radio>
                    <Radio value="medio">{t('survey.formacao_opcoes.medio')}</Radio>
                    <Radio value="graduacao">{t('survey.formacao_opcoes.graduacao')}</Radio>
                    <Radio value="especializacao">{t('survey.formacao_opcoes.especializacao')}</Radio>
                    <Radio value="mestrado">{t('survey.formacao_opcoes.mestrado')}</Radio>
                    <Radio value="doutorado">{t('survey.formacao_opcoes.doutorado')}</Radio>
                </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="area_formacao"
                    label={(index++)+"-"+t('survey.area_formacao')}
                    rules={[{ required: true, message: t('survey.common.required_option') }]}
                >
                    <Radio.Group className="flex-column" >
                        <Radio value="computacao">{t('survey.area_formacao_o.computacao')}</Radio>
                        <Radio value="engenharia">{t('survey.area_formacao_o.engenharia')}</Radio>
                        <Radio value="jogos">{t('survey.area_formacao_o.jogos')}</Radio>
                        <Radio value="design">{t('survey.area_formacao_o.design')}</Radio>
                        <Radio value="musica">{t('survey.area_formacao_o.musica')}</Radio>
                        <Radio value="comunicacao">{t('survey.area_formacao_o.comunicacao')}</Radio>
                        <Radio value="autodidata">{t('survey.area_formacao_o.autodidata')}</Radio>
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
                <Form.Item name="anos_experiencia" label={(index++)+"-"+t('survey.anos_experiencia')} rules={[{ required: true, message: t('survey.common.required_describe')  }]}>
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item name="qtd_projetos" label={(index++)+"-"+t('survey.qtd_projetos')} rules={[{ required: true, message: t('survey.common.required_describe')  }]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item
                    name="situacao"
                    label={(index++)+"-"+t('survey.situacao')}
                    rules={[{ required: true, message: t('survey.common.required_option') }]}
                >
                    <Radio.Group className="flex-column" >
                        <Radio value="atuacao_industria_integral">
                            {t('survey.situacao_o.atuacao_industria_integral')}
                        </Radio>
                        <Radio value="atuacao_industria_parcial">
                            {t('survey.situacao_o.atuacao_industria_parcial')}
                        </Radio>
                        <Radio value="atuacao_freelancer">
                            {t('survey.situacao_o.atuacao_freelancer')}
                        </Radio>
                        <Radio value="atuacao_indie_horas_vagas">
                            {t('survey.situacao_o.atuacao_indie_horas_vagas')}
                        </Radio>
                        <Radio value="atuacao_eventual">
                            {t('survey.situacao_o.atuacao_eventual')}
                        </Radio>
                        <Radio value="atuacao_nao_envolvido">
                            {t('survey.situacao_o.atuacao_nao_envolvido')}
                        </Radio>
                    </Radio.Group>
                </Form.Item>


                <Form.Item name="situacao_equipe" label={(index++)+"-"+t('survey.situacao_equipe')} rules={[{ required: true, message: t('survey.common.required_option')  }]}>
                    <Radio.Group className="flex-column" >
                        <Radio value="individual">{t('survey.situacao_equipe_o.individual')}</Radio>
                        <Radio value="pequena">{t('survey.situacao_equipe_o.pequena')}</Radio>
                        <Radio value="media">{t('survey.situacao_equipe_o.media')}</Radio>
                        <Radio value="grande">{t('survey.situacao_equipe_o.grande')}</Radio>
                        <Radio value="varia">{t('survey.situacao_equipe_o.varia')}</Radio>
                        <Radio value="nao_participa">{t('survey.situacao_equipe_o.nao_participa')}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="duracao_projetos" label={(index++) + '-' + t('survey.duracao_projetos')} rules={[{ required: true, message: t('survey.common.required_option')  }]}>
                    <Radio.Group className="flex-column" >
                        <Radio value="menos_1_mes">{t('survey.duracao_projetos_o.menos_1_mes')}</Radio>
                        <Radio value="1a3_meses">{t('survey.duracao_projetos_o.1a3_meses')}</Radio>
                        <Radio value="4a6_meses">{t('survey.duracao_projetos_o.4a6_meses')}</Radio>
                        <Radio value="7a12_meses">{t('survey.duracao_projetos_o.7a12_meses')}</Radio>
                        <Radio value="mais_1_ano">{t('survey.duracao_projetos_o.mais_1_ano')}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="funcoes"
                    label={(index++)+"-"+t('survey.funcoes')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column" >
                        <Checkbox value="gerente">{t('survey.funcoes_o.gerente')}</Checkbox>
                        <Checkbox value="programador">{t('survey.funcoes_o.programador')}</Checkbox>
                        <Checkbox value="artista">{t('survey.funcoes_o.artista')}</Checkbox>
                        <Checkbox value="animacao">{t('survey.funcoes_o.animacao')}</Checkbox>
                        <Checkbox value="design_ux">{t('survey.funcoes_o.design_ux')}</Checkbox>
                        <Checkbox value="game_designer">{t('survey.funcoes_o.game_designer')}</Checkbox>
                        <Checkbox value="level_designer">{t('survey.funcoes_o.level_designer')}</Checkbox>
                        <Checkbox value="qa">{t('survey.funcoes_o.qa')}</Checkbox>
                        <Checkbox value="artista_som">{t('survey.funcoes_o.artista_som')}</Checkbox>
                        <Checkbox value="roteiro_narrativa">{t('survey.funcoes_o.roteiro_narrativa')}</Checkbox>
                        <Checkbox value="marketing">{t('survey.funcoes_o.marketing')}</Checkbox>
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
                    label={(index++)+"-"+t('survey.tipos_jogos')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column"  options={[
                        { label: t('survey.tipos_jogos_options.fps'), value: 'fps' },
                        { label: t('survey.tipos_jogos_options.educacional'), value: 'educacional' },
                        { label: t('survey.tipos_jogos_options.rpg'), value: 'rpg' },
                        { label: t('survey.tipos_jogos_options.aventura_narrativa'), value: 'aventura_narrativa' },
                        { label: t('survey.tipos_jogos_options.2d'), value: '2d' },
                        { label: t('survey.tipos_jogos_options.3d'), value: '3d' },
                        { label: t('survey.tipos_jogos_options.plataforma'), value: 'plataforma' },
                        { label: t('survey.tipos_jogos_options.boardgame'), value: 'boardgame' },
                        { label: t('survey.tipos_jogos_options.puzzle'), value: 'puzzle' },
                        { label: t('survey.tipos_jogos_options.simulacao'), value: 'simulacao' },
                        { label: t('survey.tipos_jogos_options.manager'), value: 'manager' },
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
                    label={(index++) + '-' + t('survey.plataformas_desenvolvimento')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group
                        className="flex-column"
                        options={[
                            { label: t('survey.plataformas_desenvolvimento_o.pc'), value: 'pc' },
                            { label: t('survey.plataformas_desenvolvimento_o.web'), value: 'web' },
                            { label: t('survey.plataformas_desenvolvimento_o.mobile'), value: 'mobile' },
                            { label: t('survey.plataformas_desenvolvimento_o.console'), value: 'console' },
                            { label: t('survey.plataformas_desenvolvimento_o.xr'), value: 'xr' },
                            { label: t('survey.common.outra'), value: 'outro' },
                        ]}
                    />
                </Form.Item>


                {data['plataformas_desenvolvimento']?.includes('outro') && (
                    <Form.Item
                        name="plataformas_desenvolvimento_outro"
                        label={(index-1)+"a-"+t('survey.common.outra_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}


                <Form.Item
                    name="ferramentas_desenvolvimento"
                    label={(index++) + '-' + t('survey.ferramentas_desenvolvimento')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group
                        className="flex-column"
                        options={[
                            { value: 'unity', label: t('survey.ferramentas_desenvolvimento_options.unity') },
                            { value: 'unreal', label: t('survey.ferramentas_desenvolvimento_options.unreal') },
                            { value: 'godot', label: t('survey.ferramentas_desenvolvimento_options.godot') },
                            { value: 'gamemaker', label: t('survey.ferramentas_desenvolvimento_options.gamemaker') },
                            { value: 'rpgmaker', label: t('survey.ferramentas_desenvolvimento_options.rpgmaker') },
                            { value: 'propria_pessoal', label: t('survey.ferramentas_desenvolvimento_options.propria_pessoal') },
                            { value: 'propria_corporativa', label: t('survey.ferramentas_desenvolvimento_options.propria_corporativa') },
                            { value: 'framework_baixo_nivel', label: t('survey.ferramentas_desenvolvimento_options.framework_baixo_nivel') },
                            { value: 'nada', label: t('survey.ferramentas_desenvolvimento_options.nada') },
                            { value: 'outro', label: t('survey.common.outra') },
                        ]}
                    />
                </Form.Item>


                {data['ferramentas_desenvolvimento']?.includes('outro') && (
                    <Form.Item
                        name="ferramentas_desenvolvimento_outro"
                        label={(index-1)+"a-"+t('survey.common.outra_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}


            </Card>

            <Card title={t('survey.software_engeniring')}>
                <Typography.Title level={5}>
                    <span className="required-extra">* </span>
                    {(index++) + ' - ' + t('survey.uso_praticas.label')}
                </Typography.Title>
                {currentScreen.xs ? (
                  praticas.map((key) => (
                    <Card key={key} style={{ marginBottom: 12 }}>
                      <Typography.Text strong>{t(`survey.uso_praticas_${key}`)}</Typography.Text>
                      <Form.Item
                        name={'uso_praticas_'+key}
                        rules={[{ required: true, message: t('survey.common.required_option') }]}
                      >
                        <Radio.Group>
                          {problemas_praticas.map((optionKey) => (
                            <Radio  key={key+"_"+optionKey} value={optionKey}>{t(`survey.uso_praticas.opcoes.${optionKey}`)}</Radio>
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
                            <th key={optionKey}>{t(`survey.uso_praticas.opcoes.${optionKey}`)}</th>
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
                                <td>{t(`survey.uso_praticas_${key}`)}</td>
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
                    label={(index++) + '-' + t('survey.dificuldades_manutencao')}
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
                                {t(`survey.dificuldades_manutencao_o.${value}`)}
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
                    name="testes_jogo"
                    label={(index++)+"-"+t('survey.testes_jogo')}
                    rules={[{ required: tester_selected, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'exploratorio', label: t('survey.testes_jogo_options.exploratorio') },
                        { value: 'roteiro', label: t('survey.testes_jogo_options.roteiro') },
                        { value: 'automatizado', label: t('survey.testes_jogo_options.automatizado') },
                        { value: 'outro', label: t('survey.common.outro') },
                    ]} />
                </Form.Item>

                {data['testes_jogo']?.includes('outro') && (
                    <Form.Item
                        name="testes_jogo_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="dificuldades_testes"
                    label={(index++)+"-"+t('survey.dificuldades_testes')}
                    rules={[{ required: tester_selected, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'entendimento_frameworks', label: t('survey.dificuldades_testes_options.entendimento_frameworks') },
                        { value: 'implementacao_dificil', label: t('survey.dificuldades_testes_options.implementacao_dificil') },
                        { value: 'preferencia_humanos', label: t('survey.dificuldades_testes_options.preferencia_humanos') },
                        { value: 'nao_encontram_erros_reais', label: t('survey.dificuldades_testes_options.nao_encontram_erros_reais') },
                        { value: 'nunca_usei', label: t('survey.dificuldades_testes_options.nunca_usei') },
                        { value: 'outro', label: t('survey.common.outro') }
                    ]} />
                </Form.Item>

                {data['dificuldades_testes']?.includes('outro') && (
                    <Form.Item
                        name="dificuldades_testes_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="ferramentas_teste"
                    label={(index++)+"-"+t('survey.ferramentas_teste')}
                    rules={[{ required: data['testes_jogo']?.includes('automatizado'), message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'unity', label: t('survey.ferramentas_teste_options.unity') },
                        { value: 'unreal', label: t('survey.ferramentas_teste_options.unreal') },
                        { value: 'godot_test_plugin', label: t('survey.ferramentas_teste_options.godot_tests') },
                        { value: 'outro', label: t('survey.common.outro') }
                    ]} />
                </Form.Item>

                {data['ferramentas_teste']?.includes('outro') && (
                    <Form.Item
                        name="ferramentas_teste_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="conteudo_testado"
                    label={(index++)+"-"+t('survey.conteudo_testado')}
                    rules={[{ required: data['testes_jogo']?.includes('automatizado'),
                        message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'componentes', label: t('survey.conteudo_testado_options.componentes') },
                        { value: 'performance', label: t('survey.conteudo_testado_options.performance') },
                        { value: 'cenarios', label: t('survey.conteudo_testado_options.cenarios') },
                        { value: 'teste_fumaca', label: t('survey.conteudo_testado_options.teste_fumaca') },
                        { value: 'outro', label: t('survey.common.outro') }
                    ]} />
                </Form.Item>

                {data['conteudo_testado']?.includes('outro') && (
                    <Form.Item
                        name="conteudo_testado_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="etapa_testes"
                    label={(index++)+"-"+t('survey.etapa_testes')}
                    rules={[{ required: data['testes_jogo']?.includes('automatizado'),
                        message: t('survey.common.required_option') }]}
                >
                    <Radio.Group className="flex-column"   options={[
                        { value: 'antes_funcionalidade', label: t('survey.etapa_testes_options.antes_funcionalidade') },
                        { value: 'durante_funcionalidade', label: t('survey.etapa_testes_options.durante_funcionalidade') },
                        { value: 'pos_prototipo', label: t('survey.etapa_testes_options.pos_prototipo') },
                        { value: 'final', label: t('survey.etapa_testes_options.final') },
                        { value: 'quando_possivel', label: t('survey.etapa_testes_options.quando_possivel') },
                        { value: 'outro', label: t('survey.common.outro') }
                    ]} />
                </Form.Item>

                {data['etapa_testes']?.includes('outro') && (
                    <Form.Item
                        name="etapa_testes_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="requisito_testes"
                    label={(index++)+"-"+t('survey.requisito_testes')}
                    rules={[{ required: data['testes_jogo']?.includes('automatizado'),
                        message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'atualizacao', label: t('survey.requisito_testes_options.atualizacao') },
                        { value: 'proxima_fase', label: t('survey.requisito_testes_options.proxima_fase') },
                        { value: 'nova_funcionalidade', label: t('survey.requisito_testes_options.nova_funcionalidade') },
                        { value: 'nunca', label: t('survey.requisito_testes_options.nunca') },
                        { value: 'outro', label: t('survey.common.outro') }
                    ]} />
                </Form.Item>

                {data['requisito_testes']?.includes('outro') && (
                    <Form.Item
                        name="requisito_testes_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

            </Card>
            <Card title={t('survey.creative_process')}>
                <Form.Item
                    name="avaliacao_artefatos"
                    label={(index++) + " - " + t('survey.avaliacao_artefatos')}
                    rules={[{ required: artist_selected, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column"  options={[
                        { value: 'criterios_definidos', label: t('survey.avaliacao_artefatos_o.criterios_definidos') },
                        { value: 'avaliacao_subjetiva', label: t('survey.avaliacao_artefatos_o.avaliacao_subjetiva') },
                        { value: 'testes_formais', label: t('survey.avaliacao_artefatos_o.testes_formais') },
                        { value: 'avaliacao_por_outros', label: t('survey.avaliacao_artefatos_o.avaliacao_por_outros') },
                        { value: 'sem_avaliacao_estruturada', label: t('survey.avaliacao_artefatos_o.sem_avaliacao_estruturada') },
                        { value: 'outro', label: t('survey.common.outro') },
                    ]} />
                </Form.Item>

                {data['avaliacao_artefatos']?.includes('outro') && (
                    <Form.Item
                        name="avaliacao_artefatos_outro"
                        label={(index - 1) + "a - " + t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="design_validacao"
                    label={(index++)+"-"+t('survey.design_validacao')}
                    rules={[{ required: design_selected, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column"   options={[
                        { value: 'prototipo_simplificado', label: t('survey.design_validacao_options.prototipo_simplificado') },
                        { value: 'prototipo_real', label: t('survey.design_validacao_options.prototipo_real') },
                        { value: 'excel', label: t('survey.design_validacao_options.excel') },
                        { value: 'machinations', label: t('survey.design_validacao_options.machinations') },
                        { value: 'mental', label: t('survey.design_validacao_options.mental') },
                        { value: 'outro', label: t('survey.common.outro') },
                    ]} />
                </Form.Item>

                {data['design_validacao']?.includes('outro') && (
                    <Form.Item
                        name="design_validacao_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Card>
            <Card title={t('survey.generative_ia')}>
                <Form.Item
                    name="areas_uso_ia"
                    label={(index++)+"-"+t('survey.areas_uso_ia')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column" >
                        <Checkbox value="ideias_criativas">{t('survey.areas_uso_ia_o.ideias_criativas')}</Checkbox>
                        <Checkbox value="conteudo_visual_sonoro">{t('survey.areas_uso_ia_o.conteudo_visual_sonoro')}</Checkbox>
                        <Checkbox value="implementacao">{t('survey.areas_uso_ia_o.implementacao')}</Checkbox>
                        <Checkbox value="planejamento">{t('survey.areas_uso_ia_o.planejamento')}</Checkbox>
                        <Checkbox value="testes">{t('survey.areas_uso_ia_o.testes')}</Checkbox>
                        <Checkbox value="validacao">{t('survey.areas_uso_ia_o.validacao')}</Checkbox>
                        <Checkbox value="ainda_nao_usei">{t('survey.areas_uso_ia_o.ainda_nao_usei')}</Checkbox>
                        <Checkbox value="nao_usarei">{t('survey.areas_uso_ia_o.nao_usarei')}</Checkbox>
                        <Checkbox value='outro'>{t('survey.common.outro') }</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {data.areas_uso_ia?.includes('outro') && (
                    <Form.Item
                        name="areas_uso_ia_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="percepcao_uso_ia"
                    label={(index++) + " - " + t('survey.percepcao_uso_ia')}
                    rules={[{ required: true, message: t('survey.common.required_one_option') }]}
                >
                    <Checkbox.Group className="flex-column" >
                        {problemas_ia.map((value) => (
                            <Checkbox
                                key={value}
                                value={value}
                                disabled={
                                    data["percepcao_uso_ia"]?.length >= 2 &&
                                    !data["percepcao_uso_ia"].includes(value)
                                }
                            >
                                {t(`survey.percepcao_uso_ia_options.${value}`)}
                            </Checkbox>
                        ))}
                        <Checkbox value='outro'>{t('survey.common.outro') }</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {data.temores_uso_ia?.includes('outro') && (
                    <Form.Item
                        name="percepcao_uso_ia_outro"
                        label={(index-1)+"a-"+t('survey.common.outro_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Card>


            <Card title={t("survey.final_remarks")}>
            <Form.Item name="consideracoes_finais" label={(index++)+"-"+t('survey.any_comment')}>
                <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item name="contato_entrevista" label={(index++)+"-"+t('survey.contato_entrevista')} rules={[{ required: true, message: t('survey.common.required_option')  }]}>
                <Radio.Group>
                    <Radio value="sim">{t('survey.common.sim')}</Radio>
                    <Radio value="nao">{t('survey.common.nao')}</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="email" rules={[{required:data["contato_entrevista"]==="sim", message: t('survey.email_required')}]}
                       label={(index++)+"-"+
                           (data["contato_entrevista"]==="sim"?t('survey.email'):t('survey.email_contato'))}>
                <Input type="email" />
            </Form.Item>
            </Card>
            <RequiredFieldsSummary
                missingFields={requiredErrors}
            />

            <Form.Item>
                <Button loading={loading} type="primary" block htmlType="submit">{t('survey.enviar')}</Button>
            </Form.Item>

        </Form>
        </Card>
    );
};

export default SurveyForm;
