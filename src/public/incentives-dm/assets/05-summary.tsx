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

  return (
        <div className="chart-wrapper">
            <p>You have completed all the trials! <b>Your remaining budget is: $<span id="remaining-budget">{budget}</span></b></p>
            <p>On the next page we will ask you some open-ended questions regarding your experience in performing the tasks in this survey.</p>
        </div>
    );
}

export default DisplayTrial;
