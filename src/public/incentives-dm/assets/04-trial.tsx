import * as d3 from 'd3';
import {useCallback, useEffect, useMemo, useState} from 'react';
import { StoredAnswer, StimulusParams } from '../../../store/types';

function boxMullerTransform(seed: number) {
    const rand = mulberry32(seed);

    const u1 = rand();
    const u2 = rand();

    // const u1 = Math.random();
    // const u2 = Math.random();

    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    return z;
}

function rnorm(seed: number, mean: number, stddev: number) {
    const z = boxMullerTransform(seed);
    return z * stddev + mean;
}

// Source - https://stackoverflow.com/a/47593316
// Posted by bryc, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-09, License - CC BY-SA 4.0
function cyrb128(str: string) {
    let h1 = 1779033703; let h2 = 3144134277;
    let h3 = 1013904242; let
    h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function mulberry32(a: number) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// This React component renders a bar chart with 5 bars and 2 of them highlighted by dots.
// The data value comes from the config file and pass to this component by parameters.
function DisplayTrial({ parameters, setAnswer, answers }: StimulusParams<{index: number, vis: string}>) {
    const { index, vis } = parameters;
    const [forecast, setForecast] = useState<number>();

    const imgURL = `../incentives-dm/assets/img/trial/${vis}-trial-${index}.jpg`;

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
        const tempMean = 29 + index * 0.5;
        const tempSd = 2.08;
        const seed = cyrb128(prolificId + "_" + {index}); // change to prolific ID
        const temp = rnorm(seed[0], tempMean, tempSd); // simulate rnorm(mean)

        if (!forecast) {
            setForecast(temp);
            setAnswer({
                status: true,
                answers: {
                    // @ts-ignore
                    simulatedResult: { seed: seed[0], tempMean: tempMean, simulated: temp, startingBudget: budget },
                },
            });
        } else {
            setAnswer({
                status: true,
                answers: {
                // @ts-ignore
                simulatedResult: { seed: seed[0], tempMean: tempMean, simulated: forecast, startingBudget: budget },
                },
            });
        }
    }, [index, setAnswer, budget, forecast]);

  return (
        <div className="chart-wrapper">
            <h3>
                Trial number:
                <span id="task-index"> {trialIndex}</span>
                /18
            </h3>
            <p>
                Budget Remaining: $
                <span id="remaining-budget">{budget}</span>
            </p>
            <div className="img-container">
                <img src={imgURL} width="90%" />
            </div>
        </div>
    );
}

export default DisplayTrial;
