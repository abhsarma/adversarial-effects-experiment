import * as d3 from 'd3';
import {useCallback, useEffect, useMemo, useState} from 'react';
import { StoredAnswer, StimulusParams } from '../../../store/types';
import '../../styles/incentives.css';

// Chart dimensions
const chartSettings = {
  marginBottom: 40,
  marginLeft: 40,
  marginTop: 15,
  marginRight: 15,
  width: 400,
  height: 400,
};

// This React component renders a bar chart with 5 bars and 2 of them highlighted by dots.
// The data value comes from the config file and pass to this component by parameters.
function DisplayTrial({ parameters, setAnswer, answers }: StimulusParams<{index: number, vis: string}>) {
    const { index, vis } = parameters;

    const prolificId = useMemo(() => {
        return Object.entries(answers)[0][1].answer.prolificId;
    }, [answers, index]);

    const current = useMemo(() => {
            return Object.entries(answers).find(([key, _]) => key.split("_")[0] === `trial-${index}`)?.[1];
        }, [answers, index]);

    const trialIndex = useMemo(() => {
        return current ? +current.trialOrder - 4 : 1; // 4 is the number of pre-trial steps
    }, [answers, index]);

    const budget = useMemo(() => {
        const previous = current ? Object.values(answers).find((val) => +val.trialOrder === +current.trialOrder - 1) : null;
        const start = 18000;

        if (!previous?.answer.simulatedResult) {
            return start;
        }

        // @ts-ignore
        return previous.answer.simulatedResult.startingBudget - (previous.answer.decision === 'Yes' ? 1000 : previous.answer.simulatedResult.simulated < 32 ? 4000 : 0);
    }, [answers, index]);

    useEffect(() => {
        // false / low / high
        let condition_incentives = "low";

        // $6 in no incentives; $4 in low incentives; $2 in high incentives
        let pay_amount = "$4";

        // $0 in no incentives; $0.2 in low incentives; $0.4 in high incentives
        let incentive_amount_desc = "and an additional $0.2 for each correct decision";

        let hypothetical_cond_text;

        if (!condition_incentives) {
            hypothetical_cond_text = "a fixed amount of $4 and paid an additional bonuses of $0.2 for each correct decision"
        } else {
            hypothetical_cond_text = "only a fixed amount of $6 and not paid any additional bonuses"
        }

        let question_str = `<span>In this study you were paid a fixed amount of ${pay_amount} for participating in the study${incentive_amount_desc}.<br/><i>If you were instead paid ${hypothetical_cond_text}</i>, do you think it would have impacted how you approached the task. Please explain.</span><span style="color: rgb(250, 82, 82); margin-left: 4px;">*</span>`

        d3.select("span.insert-text").html(question_str);
    }, []);

  return (
        <div className="chart-wrapper">
            <p>
                You have completed all the trials! Your remaining budget is: $
                <span id="remaining-budget">{budget}</span>
            </p>
        </div>
    );
}

export default DisplayTrial;
