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
function DisplayTrial({ parameters, setAnswer, answers }: StimulusParams<{inc: string}>) {
    const { inc } = parameters;

    const inc_amount = inc == "inc-sm" ? "2.5" : "1.5";
    const inc_text = inc != "base" ? `Please do not worry if you have a negative budget. You are still guaranteed the minimum amount of $${inc_amount}.` : ""

    const current = useMemo(() => {
            // console.log(Object.entries(answers).find(([key, _]) => key.split("_")[0].includes("qual-q"))); // .find(([key, _]) => key.split("_")[0].includes("qual-q")))
            return Object.entries(answers).find(([key, _]) => key.split("_")[0].includes("qual-q"))?.[1];
        }, [answers]);

    const budget = useMemo(() => {
        const previous = current ? Object.values(answers).find((val) => +val.trialOrder === +current.trialOrder - 1) : null;

        if (!previous?.answer.simulatedResult) {
            throw new Error("unable to calculate remaining budget!");
        }

        // @ts-ignore
        return previous.answer.simulatedResult.startingBudget - (previous.answer.decision === 'Yes' ? 1000 : previous.answer.simulatedResult.simulated < 32 ? 5000 : 0);
    }, [answers]);

  return (
        <div className="chart-wrapper">
            <p>You have completed all the trials! <b>Your remaining budget is: $<span id="remaining-budget">{budget}</span></b></p>
            <p>{inc_text}</p>
            <p>On the next page we will ask you some open-ended questions regarding your experience in performing the tasks in this survey.</p>
        </div>
    );
}

export default DisplayTrial;
