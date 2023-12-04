<!--
Diagnosis App - Questions
-->
<template>
    <TopModal></TopModal>
    <transition name="fade">
        <div class="diagnosis">
            <Indicator :current-step="status.current.step"></Indicator>
            <div class="diagnosis_area" ref="_$questions">
                <template v-for="group in QuestionsJSON" >
                    <transition name="fade" appear>
                        <div v-show="status.current.step === group.category_id" class="diagnosis_container">
                            <div class="diagnosis_head">
                                <div class="diagnosis_headWrap">
                                    <div class="diagnosis_headIcon">
                                        <img :src="`/images/diagnosis/icon_question_${group.category_name}.svg`" alt="">
                                    </div>
                                    <div class="diagnosis_headTitles">
                                        <p class="diagnosis_headNumber">Step{{group.category_id}}</p>
                                        <h2 class="diagnosis_headTitle">Please tell us about the current situation regarding <span class="u-textColor-primary">{{group.category_name_locale}}</span> measures.</h2>
                                    </div>
                                </div>
                                <div class="diagnosis_headMsgWrap">
                                    <p class="diagnosis_headMsg">Please select one of the following items.</p>
                                    <p class="diagnosis_headNote"><span class="u-textColor-primary">※</span>Answers are required for all questions.</p>
                                </div>
                            </div>
                            <div class="questions">
                                <template v-if="status.current.step === group.category_id" v-for="(question, j) in group.question">
                                    <div :class="{ 'questions_box': true, 'isError': status.v$[question.number].$errors.length}">
                                        <div class="questions_boxHead">
                                            <p class="questionNumber">Q{{question.number}}</p>
                                            <div class="questions_boxHeadWrap">
                                                <p class="questionText">{{question.text}}</p>
                                                <p class="questionErrorMsg">※Required fields. Please select the item below.</p>
                                            </div>
                                        </div>
                                        <div class="questions_boxBody">
                                            <ul class="answers">
                                                <template v-for="(answer, k) in AnswersJSON">
                                                    <li :class="`answers_item ${(status.vModel[group.category_name][`${question.number}`] === k) ? 'isSelected' : ''}`">
                                                        <label
                                                            v-if="status.current.answersForResult[j]"
                                                            :for="`answer_${group.category_id}-${question.number}-${answer.number}`"
                                                        >
                                                            <input type="radio"
                                                                   :id="`answer_${group.category_id}-${question.number}-${answer.number}`"
                                                                   :name="`question_${group.category_id}-${question.number}`"
                                                                   :value="k"
                                                                   v-model="status.vModel[group.category_name][question.number]"
                                                            >{{answer.text}}
                                                        </label>
                                                    </li>
                                                </template>
                                            </ul>
                                            <div class="comment">
                                                <p class="comment_head">Free amendment and comment</p>
                                                <label class="comment_textarea">
                                                <textarea
                                                    v-if="status.current.answersForResult[j]"
                                                    v-model="status.current.answersForResult[j].comment"
                                                    id="comment_textarea"
                                                    name="comment_textarea"
                                                    placeholder="Describe here. (max. 200 characters) "
                                                    maxlength="200">
                                                </textarea>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="status.current.step === 4 && group.question.length === question.number " class="questions_box questions_box-extra">
                                        <div class="questions_boxHead">
                                            <p class="questionNumber">Q{{question.number + 1}}</p>
                                            <div class="questions_boxHeadWrap">
                                                <p class="questionText">{{ExQuestionJSON.text}}</p>
                                            </div>
                                        </div>
                                        <div class="questions_boxBody">
                                            <div class="comment">
                                                <label class="comment_textarea">
                                                    <textarea v-model="status.vModel.extraQuestionAnswer" placeholder="Describe here. (max. 500 characters) " maxlength="500"></textarea>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <button class="c-btn diagnosis_btn" @click="clickNextBtnEvent">
                                {{ status.current.step === 4 ? 'SEE REPORT': 'NEXT' }}
                            </button>
                        </div>
                    </transition>
                </template>
            </div>
            <transition name="fade" appear>
                <div v-show="status.isOverNotApplicableCount" class="c-modal diagnosis_alertModal">
                    <div class="diagnosis_alertModalInner">
                        <div class="diagnosis_alertModalBox">
                            <p class="diagnosis_alertModalMsg">
                                If 50% or more of the answers are <br class="sp">"<span class="u-textColor-primary">Not applicable</span>" <br class="sp">to your organization,<br>Unable to calculate score results.
                            </p>
                            <button class="c-btn diagnosis_alertModalBtn" @click="hideAlertModal">Correct the selected items.</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script setup>

import { reactive, watch, ref, onBeforeMount } from "vue";

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import TopModal from './TopModal.vue'
import Indicator from './Indicator.vue'

import DiagnosisJSON from "../assets/questions.json";
const QuestionsJSON = DiagnosisJSON[0].questions;
const ExQuestionJSON = DiagnosisJSON[0].extra;
const AnswersJSON = DiagnosisJSON[0].answers;

import ResultFormatJSON from "../assets/resultDataFormat.json";
const ResultSendFormat = ResultFormatJSON[0];

import EvaluationConfigJSON from "../assets/evaluationConfig.json";

const status = reactive({
    current: {
        step: 1,
        answerValues: [],
        answerPriorities: [],
        answersForResult: [],
        questionLength: [],
        questionCategory: null,
    },
    vModel: {
        organization: {}, // ex.) {1: 0, q_2...}:
        operation: {},
        technique: {},
        supply_chain: {},
        extraQuestionAnswer: "",
    },
    validations: {
        rules: {
            organization: {}, // ex.) {1: {required}, 2...}:
            operation: {},
            technique: {},
            supply_chain: {}
        },
        v$: null
    },
    isOverNotApplicable: false,
    answerValuesForEvaluation: [],
})

const emits = defineEmits(
    ['finished-diagnosis']
)

const _$questions = ref();

onBeforeMount(() => {
    QuestionsJSON.forEach((category) => {
        category.question.forEach((question) => {
            status.vModel[category['category_name']][`${question['number']}`] = "";
            status.validations.rules[category['category_name']][`${question['number']}`] = { required };
        })
    })

    watch(status.current.answerValues, () => {
        if (validateQuestionAnswer()) {
            status.isOverNotApplicableCount = true;
        }
    })

    setQuestionSetting();
})

const setQuestionSetting = () => {
    const currentQuestions = QuestionsJSON.find((group) => {
        return group.category_id === status.current.step
    });

    status.current.questionCategory = currentQuestions["category_name"];

    status.current.questionLength = currentQuestions["question"].length;

    currentQuestions["question"].forEach((question) => {
        status.current.answersForResult.push({
            "cat_id": currentQuestions["category_id"],
            "order": question["number"],
            "question": question["text"],
            "answer": "",
            "comment": "",
        })
        status.current.answerPriorities.push(question['priority']);
    })

    watch(status.vModel[status.current.questionCategory], () => {
        Object.keys(status.vModel[status.current.questionCategory]).forEach((key, index) => {
            status.current.answerValues[index] = status.vModel[status.current.questionCategory][key];
        });
    })

    status.v$ = useVuelidate(status.validations.rules[status.current.questionCategory], status.vModel[status.current.questionCategory])
}

/**
 * @returns {Promise<void>}
 */
const questionValidate = async () => {
    const isValidationThrough = await status.v$.$validate()

    if (!isValidationThrough) {
        throw "typeNull";
    }

    const count = status.current.answerValues.reduce((total, value) => {
        return total + (value === 0 ? 1 : 0)
    }, 0);

    const validateBorderCount = Math.ceil(status.current.questionLength / 2);

    if (count >= validateBorderCount) {
        throw "typeOverCount";
    }
}

const clickNextBtnEvent = () => {
    questionValidate()
        .then(() => {
            calculateCategoryScore();
            saveAnsweredData();
            pushEvaluationValues();

            if (status.current.step >= QuestionsJSON.length) {
                finishQuestionStep();
            } else {
                resetCurrentAnswers();
            }

            window.scrollTo({top: 0});
        })

        .catch((type) => {
            if (type === "typeOverCount") {
                status.isOverNotApplicableCount = true;

            } else {
                const $firstErrorItem = _$questions.value.querySelector('.isError');
                const scrollAmountY = $firstErrorItem.getBoundingClientRect().top;
                window.scrollBy({top: scrollAmountY, behavior: 'smooth'});
            }
        })
}

/**
 * score = priority * constant_score / totalPriority
 */
const calculateCategoryScore = () => {
    const priorities = status.current.answerPriorities;

    const totalPriorityAmount = priorities.reduce((sum, value) => {
        return sum + value;
    }, 0);

    const answerWeights = status.current.answerValues.map((value) => {
        return AnswersJSON[value]['constant_score'];
    });

    let score = 0;

    for (let i = 0; i < status.current.answerValues.length; i++) {
        score += Math.round(((((priorities[i]) * answerWeights[i]) / totalPriorityAmount)) * 100);
    }

    ResultSendFormat["scores"][`score_${status.current.questionCategory}`] = score;
}

const saveAnsweredData = () => {
    status.current.answerValues.forEach((answerValue, i) => {
        status.current.answersForResult[i]['answer'] = AnswersJSON[answerValue]['text'];
    })

    status.current.answersForResult.forEach((data) => {
        ResultSendFormat['questions'].push(data);
    })
}

const pushEvaluationValues = () => {
    const currentCategory = status.current.questionCategory;
    const evaluateTargetQuestions = EvaluationConfigJSON[0]["evaluate_targets"][currentCategory]['questions'];

    evaluateTargetQuestions.forEach((question) => {
        status.current.answerValues.forEach((answerValue, i) => {
            if (question['question_number'] === status.current.answersForResult[i]['order']) {
                status.answerValuesForEvaluation.push(answerValue);
            }
        })
    })
}

const resetCurrentAnswers = () => {
    const answerLength = status.current.answerValues.length;

    status.current.answerValues.splice(0, answerLength)
    status.current.answersForResult.splice(0, answerLength);
    status.current.answerPriorities.splice(0, answerLength);

    status.current.step++;

    setQuestionSetting();
}

const finishQuestionStep = () => {
    ResultSendFormat['questions'].push({
        "cat_id": ExQuestionJSON['category_id'],
        "order": ExQuestionJSON['order'],
        "question": ExQuestionJSON['text'],
        "answer": status.vModel.extraQuestionAnswer,
        "comment": "",
    })

    calculateTotalScore();
    createResultURL();
    completeAllDiagnosis();
}

/**
 * totalScore = ((organizationScore * 3) + (operationScore * 3) + (techniqueScore * 3) + supplyChainScore) / 10
 */
const calculateTotalScore = () => {
    ResultSendFormat['scores']['score_total'] = Math.ceil(
        0.1 * (
            (ResultSendFormat['scores']['score_organization'] * 3) +
            (ResultSendFormat['scores']['score_operation'] * 3) +
            (ResultSendFormat['scores']['score_technique'] * 3) +
            (ResultSendFormat['scores']['score_supply_chain'])
        )
    )
}


const createResultURL = () => {
    const answerValues = status.answerValuesForEvaluation.join("");

    const urlParam = {
        score_total: `?tt=${ResultSendFormat['scores']['score_total']}`,
        score_organization: `&or=${ResultSendFormat['scores']['score_organization']}`,
        score_operation: `&op=${ResultSendFormat['scores']['score_operation']}`,
        score_technique: `&te=${ResultSendFormat['scores']['score_technique']}`,
        score_supply_chain: `&su=${ResultSendFormat['scores']['score_supply_chain']}`,
        evaluation_numbers: `&kp=${answerValues}`,
    }

    ResultSendFormat['result_url'] =
        window.location.protocol + "//" + window.location.hostname + "/result/"
        + urlParam['score_total']
        + urlParam['score_organization']
        + urlParam['score_operation']
        + urlParam['score_technique']
        + urlParam['score_supply_chain']
        + urlParam['evaluation_numbers'];
}

const completeAllDiagnosis = () => {
    emits('finished-diagnosis', ResultSendFormat);
}

const validateQuestionAnswer = () => {
    const count = status.current.answerValues.reduce((total, value) => {
        return total + (value === 0 ? 1 : 0)
    }, 0);

    const validateBorderCount = Math.ceil(status.current.questionLength / 2);

    return count >= validateBorderCount;
}


const hideAlertModal = () => {
    status.isOverNotApplicableCount = false;
}

</script>