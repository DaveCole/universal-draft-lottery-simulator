import { StateUpdater, useEffect, useState } from "preact/hooks";

const ordinal = (x: number) => {
	let suffix;

	if (x % 100 >= 11 && x % 100 <= 13) {
		suffix = "th";
	} else if (x % 10 === 1) {
		suffix = "st";
	} else if (x % 10 === 2) {
		suffix = "nd";
	} else if (x % 10 === 3) {
		suffix = "rd";
	} else {
		suffix = "th";
	}

	return x.toString() + suffix;
};

type DraftBoardProps = {
	chances: number[];
	loadingProbs: boolean;
	lotteryResults: number[] | undefined;
	names: string[];
	probs: number[][];
	setChances: StateUpdater<number[]>;
	setLotteryResults: StateUpdater<number[] | undefined>;
	setNames: StateUpdater<string[]>;
	setPresetKey: StateUpdater<string>;
	hideDraftBoard: StateUpdater<boolean>;
};

export const currentYear = new Date().getFullYear();

const rowColors = [
	"draftboard__row-bkg-1",
	"draftboard__row-bkg-2",
	"draftboard__row-bkg-3",
	"draftboard__row-bkg-4",
	"draftboard__row-bkg-5",
	"draftboard__row-bkg-6",
	"draftboard__row-bkg-7",
	"draftboard__row-bkg-8",
	"draftboard__row-bkg-9",
	"draftboard__row-bkg-10",
	"draftboard__row-bkg-11",
	"draftboard__row-bkg-12",
	"draftboard__row-bkg-13",
	"draftboard__row-bkg-14",
];
const rowClasses = [
	"draftboard__row-1",
	"draftboard__row-2",
	"draftboard__row-3",
	"draftboard__row-4",
	"draftboard__row-5",
	"draftboard__row-6",
	"draftboard__row-7",
	"draftboard__row-8",
	"draftboard__row-9",
	"draftboard__row-10",
	"draftboard__row-11",
	"draftboard__row-12",
	"draftboard__row-13",
	"draftboard__row-14",
];

export const DraftBoard = (props: DraftBoardProps) => {
	const [revealRow, setRevealRow] = useState(14);
	let soundPlayed = false;
	/*
	const [alpha0, setAlpha0] = useState(0);
	const [alpha1, setAlpha1] = useState(0.0);
	const [alpha2, setAlpha2] = useState(0.0);
	const [alpha3, setAlpha3] = useState(0.0);
	const [alpha4, setAlpha4] = useState(0.0);
	const [alpha5, setAlpha5] = useState(0.0);
	const [alpha6, setAlpha6] = useState(0.0);
	const [alpha7, setAlpha7] = useState(0.0);
	const [alpha8, setAlpha8] = useState(0.0);
	const [alpha9, setAlpha9] = useState(0.0);
	const [alpha10, setAlpha10] = useState(0.0);
	const [alpha11, setAlpha11] = useState(0.0);
	const [alpha12, setAlpha12] = useState(0.0);
	const [alpha13, setAlpha13] = useState(0.0);

	const alphas:Array<number> = [];
	for (let i=0; i < 14; i++) {
		alphas.push(eval(`alpha${i}`));
	}
	*/
	const [triggerAnimation, setTriggerAnimation] = useState(false);

	useEffect(() => {
		if (props.lotteryResults) {
			setTimeout(() => {
				setTriggerAnimation(true);
			}, 1000);
			if (!soundPlayed) {
				let audio = new Audio("success-fanfare-trumpets-6185.mp3");
				audio.play();
				soundPlayed = true;
			}
		} else {
			setTriggerAnimation(false);
			setRevealRow(14);
		}
	}, [props.lotteryResults]);

	useEffect(() => {
		if (triggerAnimation) {
			// @ts-ignore
			setRevealRow(props.lotteryResults?.length);
		}
	}, [triggerAnimation]);

	useEffect(() => {
		if (triggerAnimation && revealRow >= 0) {
			console.log(`revealRow: ${revealRow}`);
			setTimeout(() => {
				setRevealRow(revealRow - 1);
			}, 2500);
		}
	}, [revealRow]);
	/*
	useEffect(() => {
		if (triggerAnimation) {
			console.log('animating')
			for (let i=13; i >= 0; i--) {
				console.log(`animating ${rowClasses[i]}`);
				gsap.to(rowClasses[i], {opacity: 1, duration: 1, delay: i * 0.2})
			}  
		}
	}, [triggerAnimation]);
	*/

	return (
		<div className="overlay">
			<div className="draftboard">
				<div className="draftboard__title">
					<div className="draftboard__title-text">
						{currentYear}-{currentYear + 1} Draft Results
					</div>
				</div>
				<div className="draftboard__results">
					{props.lotteryResults
						? props.lotteryResults.map((team, i) => {
								const name = props.names[team];
								const pick = i + 1;
								const rowclass = `${rowColors[team]}`;
								const row = `${rowClasses[i]}`;
								console.log(`rendering ${row}`);
								//const rowstyle = { backgroundColor: `linear-gradient(0deg, ${teamColors[team][0]} 0%, ${teamColors[team][1]} 100%)` };
								return (
									<div
										key={`row-${i}`}
										className={`draftboard__row ${row} ${
											revealRow < i ? "show" : ""
										}`}
									>
										<div className={`draftboard__row ${rowclass}`}>
											<div className="draftboard__row-pick">
												{ordinal(pick)}
											</div>
											<div className={`draftboard__row-team`}>{name}</div>
										</div>
									</div>
								);
						  })
						: null}
				</div>
				<div className="draftboard__button-container">
					<button
						className="draftboard__button"
						onClick={() => {
							props.hideDraftBoard(false);
						}}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};
