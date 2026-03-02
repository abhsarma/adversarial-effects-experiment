import * as d3 from 'd3';
import {useCallback, useEffect, useMemo, useState} from 'react';
import { StoredAnswer, StimulusParams } from '../../../store/types';

// This React component renders a bar chart with 5 bars and 2 of them highlighted by dots.
// The data value comes from the config file and pass to this component by parameters.
function DisplayTrial({ parameters }: StimulusParams<any>) {
    const { index, vis, target } = parameters;

    const trainingIdx = "training-" + index;
    const imgURL = `../incentives-dm/assets/img/training/0${index}-training-${vis}.jpg`;

    console.log(imgURL, index, vis, target);

    d3.select("#target").html(target);

    return (
        <div className="chart-wrapper">

            <h2>Training Trial #{index}</h2>
            <p>
                <img src={imgURL} alt={trainingIdx} width="70%"/><br/>
                Based on the forecast above, please answer the following question.
            </p>
        </div>
    );
}

export default DisplayTrial;


{/* <script>
    Revisit.onDataReceive((data) => {
        const index = data['index'];
        const vis = data['vis'];
        const target = data['target'];
        let imgStr = "./img/training/0" + index + "-training-ci.jpg";

        d3.select("span.insert-quantile").text(target);
        d3.select("img").attr("src", imgStr)
    });

    console.log(document.getElementById("target"))

    // Call out that 'barChart' needs to match ID in 'response' object
    // Revisit.postAnswers({ trainingProb: userAnswer });
</script> */}
    