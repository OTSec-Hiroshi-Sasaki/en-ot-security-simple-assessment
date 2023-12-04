<!--
Diagnosis App - Result Page
-->
<template>
    <div class="result">
        <div class="result_head">
            <p class="result_headMsg">The assessment has been developed in accordance with the checklist items in Appendix E of "The Cyber/Physical Security Framework for Factory Systems".</p>
            <button @click="toggleShowModal" class="result_headBtn"><span>Risk Evaluation and Score</span></button>
        </div>
        <div class="result_details">
            <div class="result_detailsInner">
                <h2 class="result_title">Assessment Result</h2>
                <div class="result_wrap">
                    <p class="result_lead">
                        Graph shows OT cybersecurity readiness scores for each category.<br>
                        The higher value on the graph, the more OT security readiness is.
                    </p>
                    <div class="result_scores">
                        <div class="result_scoresContainer">
                            <div class="result_scoresBox">
                                <h3 class="result_scoresHead">{{resultParams['categories']['tt']['name']}}</h3>
                                <div class="result_scoresBody">
                                    <div class="result_scoresGraphWrap"><canvas class="result_scoresGraph" ref="graph"></canvas></div>
                                    <div class="result_scoresDetail">
                                        <dl class="result_scoresWrap">
                                            <div class="result_scoresColumn result_scoresColumn-evaluation">
                                                <dt>Risk Evaluation</dt>
                                                <dd :class="`u-textColor-${resultParams['categories']['tt']['rank']}Rank`">
                                                    {{resultParams['categories']['tt']['rank'].toUpperCase()}}
                                                </dd>
                                            </div>
                                            <div class="result_scoresColumn result_scoresColumn-percent">
                                                <dt>Score</dt>
                                                <dd><span>{{resultParams['categories']['tt']['value']}}</span>%</dd>
                                            </div>
                                        </dl>
                                        <p class="result_scoresDesc">{{resultParams['categories']['tt']['text']}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="result_scoresContainer">
                            <div v-for="category in ['or','op','te','su',]" class="result_scoresBox">
                                <h3 class="result_scoresHead result_scoresHead-large">{{resultParams['categories'][category]['name']}}</h3>
                                <div class="result_scoresBody">
                                    <div class="result_scoresDetail">
                                        <dl class="result_scoresWrap">
                                            <div class="result_scoresColumn result_scoresColumn-evaluation">
                                                <dt>Risk<br>Evaluation</dt>
                                                <dd :class="`u-textColor-${resultParams['categories'][category]['rank']}Rank`">
                                                    {{resultParams['categories'][category]['rank'].toUpperCase()}}
                                                </dd>
                                            </div>
                                            <div class="result_scoresColumn result_scoresColumn-percent">
                                                <dt>Score</dt>
                                                <dd><span>{{resultParams['categories'][category]['value']}}</span>%</dd>
                                            </div>
                                        </dl>
                                        <p class="result_scoresDesc">{{resultParams['categories'][category]['text']}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="result_guide">
                        <a href="https://public-comment.e-gov.go.jp/servlet/PcmFileDownload?seqNo=0000236565" class="result_guideLink" target="_blank">
                            The Cyber/Physical Security Framework for Factory Systems(draft)
                            <div class="result_guideIcon"><img src="/images/result/icon_externalLink.svg" alt=""></div>
                        </a>
                        <p class="result_guideNote"><span class="u-textColor-primary">※</span>This assessment was developed based on the above guidelines.</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="resultData" class="result_answers">
            <div class="result_answersInner">
                <h2 class="result_answersTitle">List of selection item</h2>
                <div class="result_answersArea">
                    <details v-for="category in ['or','op','te','su']" class="result_answersBox" open>
                        <summary class="result_answersBoxHead">{{resultParams['categories'][category]['name']}}</summary>
                        <div class="result_answersBoxBody">
                            <table>
                                <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Requirement</th>
                                    <th>Selection</th>
                                    <th>Free comment</th>
                                </tr>
                                </thead>
                                <tbody>
                                <template v-for="(result, index) in resultParams['categories'][category]['diagnosedData']">
                                    <tr>
                                        <td>{{result['cat_id']}}-{{result['order']}}</td>
                                        <td>{{result['question']}}</td>
                                        <td>{{result['answer']}}</td>
                                        <td>{{result['comment']}}</td>
                                    </tr>
                                    <tr v-if="category === 'su' && resultParams['categories'][category]['diagnosedData'].length === index + 1">
                                        <td>5-1</td>
                                        <td>{{resultParams.extraQuestionAnswer.question}}</td>
                                        <td>{{resultParams.extraQuestionAnswer.answer}}</td>
                                        <td></td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                            <button @click="closeAccordion" class="result_answersCloseBtn" aria-label="Close the answer list"></button>
                        </div>
                    </details>
                </div>
            </div>
        </div>
        <transition name="fade" appear>
            <div v-show="status.isShowModal" class="c-modal result_modal">
                <div class="result_modalInner">
                    <button @click="toggleShowModal" class="result_modalBtn" aria-label="Close the modal">
                        <img src="/images/result/btn_modalClose.svg" alt="Close">
                    </button>
                    <div class="result_modalBox">
                        <p class="result_modalTitle">Risk Evaluation and Score</p>
                        <dl class="result_modalExplain">
                            <dt class="result_modalExplainHead">Score</dt>
                            <dd class="result_modalExplainScore">0〜100</dd>
                            <dd class="result_modalExplainDesc">Individual items and answers (0-4) on the check sheet are weighted to score the status of security measures. It is adjusted so that it is about 40% when all items are “partially implemented” and about 60% when “implemented”.</dd>
                        </dl>
                        <table class="result_modalExample">
                            <thead>
                            <tr>
                                <th>Risk <br class="sp">Evaluation</th>
                                <th>Score</th>
                                <th>Explanation</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="result_modalExampleRank u-textColor-aRank">A</td>
                                <td class="result_modalExampleScore">80〜</td>
                                <td class="result_modalExampleDesc">Most necessary measures are in place and procedures are documented. Risks have been sufficiently reduced, and continuous improvements are being made.</td>
                            </tr>
                            <tr>
                                <td class="result_modalExampleRank u-textColor-bRank">B</td>
                                <td class="result_modalExampleScore">60〜79</td>
                                <td class="result_modalExampleDesc">Most necessary measures are in place, but procedures are not documented. Risks have been reduced, but there are issues with continuous improvement.</td>
                            </tr>
                            <tr>
                                <td class="result_modalExampleRank u-textColor-cRank">C</td>
                                <td class="result_modalExampleScore">40〜59</td>
                                <td class="result_modalExampleDesc">Inadequate implementation of most necessary measures. The risk has not been reduced, and it is assumed that the damage at the time of security breach will be large.</td>
                            </tr>
                            <tr>
                                <td class="result_modalExampleRank u-textColor-dRank">D</td>
                                <td class="result_modalExampleScore">0〜39</td>
                                <td class="result_modalExampleDesc">Most necessary measures have not been implemented. The risk is not recognized, and it is assumed that the damage at the time of security breach is large.</td>
                            </tr>
                            </tbody>
                        </table>
                        <p class="result_modalNote">
                            <span>Notes</span>：This assessment result is created based on the answers to the requirements, <span class="u-textColor-primary">so there is a possibility that the results will differ depending on the subjectivity of the respondent</span>, and there may be a deviation from the actual situation.
                        </p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>

import {onBeforeMount, onMounted, reactive, ref} from "vue";

import EvaluationConfigJSON from "../assets/evaluationConfig.json";
const EvaluationConfigTexts = EvaluationConfigJSON[0]["evaluate_texts"];

const status = reactive({
    isShowModal: false,
})

const props = defineProps({
    resultData: {default: null},
})

const resultParams = {
    result_url: window.location.href,
    categories: {
        tt: {name: "Overall score", value: 0, rank: null, text: null},
        or: {name: "People", value: 0, rank: null, text: null, diagnosedData: []},
        op: {name: "Process", value: 0, rank: null, text: null, diagnosedData: []},
        te: {name: "Technology", value: 0, rank: null, text: null, diagnosedData: []},
        su: {name: "Supply Chain Management for Factory Assets", value: 0, rank: null, text: null, diagnosedData: []}
    },
    extraQuestionAnswer: {
        question: "",
        answer: "",
    }
}

const graph = ref();

const setResultParams = () => {
    const UrlParams = new URLSearchParams(document.location.search);
    const categories = ["tt", "or", "op", "su", "te"];

    categories.forEach((category) => {
        resultParams.categories[category]['value'] = UrlParams.get(category);
        resultParams.categories[category]['rank'] = calculateRank(UrlParams.get(category));
    })

    // Split the 9-digit sequence of 'kp' and retrieve the evaluation statements for each category.
    // Allocation → 1.2 [People] / 3.4.5 [Process] / 6.7 [Technology] / 8.9 [Supply Chain] /
    const evaluationParams = UrlParams.get("kp").split("");
    categories.forEach((category) => {
        switch (category) {
            case "or" :
                resultParams.categories[category]['text'] = createEvaluationText("Pe", [evaluationParams[0], evaluationParams[1]], resultParams.categories[category]['rank']);
                break;
            case "op" :
                resultParams.categories[category]['text'] = createEvaluationText("Pr", [evaluationParams[2], evaluationParams[3], evaluationParams[4]], resultParams.categories[category]['rank']);
                break;
            case "te" :
                resultParams.categories[category]['text'] = createEvaluationText("Te", [evaluationParams[5], evaluationParams[6]], resultParams.categories[category]['rank']);
                break;
            case "su" :
                resultParams.categories[category]['text'] = createEvaluationText("Sp", [evaluationParams[7], evaluationParams[8]], resultParams.categories[category]['rank']);
                break;
            case "tt" :
                resultParams.categories[category]['text'] = createTotalEvaluationText();
                break;
            default :
                break;
        }
    })

    if (props.resultData) {
        getDiagnosedData();
    }
}


const getDiagnosedData = () => {
    const result = props.resultData;

    result['questions'].forEach((question) => {
        switch (question['cat_id']) {
            case 1 :
                resultParams.categories['or']['diagnosedData'].push(question);
                break;
            case 2 :
                resultParams.categories['op']['diagnosedData'].push(question);
                break;
            case 3 :
                resultParams.categories['te']['diagnosedData'].push(question);
                break;
            case 4 :
                resultParams.categories['su']['diagnosedData'].push(question);
                break;
            case 99 :
                resultParams.extraQuestionAnswer.question = question['question'];
                resultParams.extraQuestionAnswer.answer = question['answer'];
                break;
            default:
                break;
        }
    })
}

/**
 * @returns {string}
 */
const createTotalEvaluationText = () => {
    const ranks = {
        or: resultParams["categories"]["or"]["rank"],
        op: resultParams["categories"]["op"]["rank"],
        te: resultParams["categories"]["te"]["rank"],
        su: resultParams["categories"]["su"]["rank"],
        tt: resultParams["categories"]["tt"]["rank"],
    };

    let evaluationTextFirst = "";
    let evaluationTextSecond = "";

    if (isHighRank(ranks.or)) {
        if (isHighRank(ranks.op) && isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-1"];
        } else if (isHighRank(ranks.op) && !isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-2"];
        } else if (!isHighRank(ranks.op) && isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-3"];
        } else if (!isHighRank(ranks.op) && !isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-4"];
        }

    } else {
        if (isHighRank(ranks.op) && isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-5"];
        } else if (isHighRank(ranks.op) && !isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-6"];
        } else if (!isHighRank(ranks.op) && isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-7"];
        } else if (!isHighRank(ranks.op) && !isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-8"];
        }
    }

    switch (ranks.tt) {
        case "a" :
            if (isHighRank(ranks.or) && isHighRank(ranks.op) && isHighRank(ranks.te)) {
                evaluationTextSecond = EvaluationConfigTexts["b-1"];
            } else {
                evaluationTextSecond = EvaluationConfigTexts["b-2"];
            }
            break;

        case "b" :
            if (isHighRank(ranks.or) && isHighRank(ranks.op) && isHighRank(ranks.te)) {
                evaluationTextSecond = EvaluationConfigTexts["b-3"];
            } else {
                evaluationTextSecond = EvaluationConfigTexts["b-2"];
            }
            break;

        case "c" :
            evaluationTextSecond = EvaluationConfigTexts["b-4"];
            break;

        case "d" :
            evaluationTextSecond = EvaluationConfigTexts["b-5"];
            break;

        default:
            break;
    }

    return evaluationTextFirst + evaluationTextSecond;
}

/**
 * @param evaluateCategory
 * @param paramsArray
 * @param rank
 * @returns {string}
 */
const createEvaluationText = (evaluateCategory, paramsArray, rank) => {
    let evaluationText = "";

    paramsArray.forEach((param, index) => {
        const categoryNumber = String(index + 1);
        evaluationText +=
            EvaluationConfigTexts[evaluateCategory + categoryNumber + '-' + param];
            // ex.) Pf1-1, Pf1-2
    })

    const rankList = ['a', 'b', 'c', 'd'];
    evaluationText += EvaluationConfigTexts[evaluateCategory + 'T-' + rankList.indexOf(rank)];
    // ex.) PfT-1

    return evaluationText;
}

/**
 * @param intScore
 * @returns {string}
 */
const calculateRank = (intScore) => {
    let rank;

    if (intScore >= 80) {
        rank = "a";
    } else if (80 > intScore && intScore >= 60) {
        rank = "b";
    } else if (60 > intScore && intScore >= 40) {
        rank = "c";
    } else {
        rank = "d";
    }

    return rank;
}

/**
 * @param rank
 * @returns {boolean}
 */
const isHighRank = (rank) => {
    return (rank === 'a' || rank === 'b');
}

/**
 * @param $el
 */
const closeAccordion = ($el) => {
    $el.target.closest('.result_answersBox').open = false;
}

const toggleShowModal = () => {
    status.isShowModal = !status.isShowModal;
}

/**
 * Chart.js
 * https://misc.0o0o.org/chartjs-doc-ja/
 */
const generateChart = () => {
    new Chart(graph.value, {
        type: "radar",
        data: {
            labels: ["", "", "", ""],
            datasets: [
                {
                    data: [
                        resultParams['categories']['or']['value'],
                        resultParams['categories']['op']['value'],
                        resultParams['categories']['te']['value'],
                        resultParams['categories']['su']['value']
                    ],
                    backgroundColor: "rgba(9,101,180,0.4)",
                    borderCapStyle: "square",
                    borderColor: "rgba(9,101,180,0.8)",
                    borderJoinStyle: "",
                    borderWidth: 2,
                    pointRadius: 0,
                }
            ]
        },
        options: {
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: "#B1A6A6",
                        borderDash: [1, 3],
                    },
                    ticks: {
                        display: false,
                        count: 6,
                    },
                    angleLines: {
                        color: "#B1A6A6",
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                }
            },
            animation: {
                duration: 1500
            }
        },
    });
}

onBeforeMount(() => {
    setResultParams();
})

onMounted(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    generateChart();
})

</script>