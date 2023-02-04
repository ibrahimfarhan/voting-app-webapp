import styles from './voting-results.module.scss';
import { PieChart } from 'react-minimal-pie-chart';
import { Data } from 'react-minimal-pie-chart/types/commonTypes';
import { indicativeVotingOptions } from '../../realtime/voting-connection';

const colors = [
  'tomato',
  'green',
  'orange',
  'gray',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];
export interface VotingResultsProps {
  memberVotes: { [username: string]: number }
}

const VotingResults = ({ memberVotes }: VotingResultsProps) => {

  const aggs = Object.keys(memberVotes)
    .reduce((agg: {
      countPerVote: { [k: string]: number },
      avgNominator: number,
      avgDenominator: number,
    }, member) => {
      const vote = memberVotes[member] || 0;

      if (vote <= 0) return agg;

      agg.countPerVote[vote] = agg.countPerVote[vote]
        ? agg.countPerVote[vote] + 1
        : 1;

      agg.avgNominator += vote;
      agg.avgDenominator++;

      return agg;
    }, {
      countPerVote: {},
      avgNominator: 0,
      avgDenominator: 0,
    });

  const {
    countPerVote = {},
    avgDenominator = 0,
    avgNominator = 0,
  } = aggs;

  const roundedAvg = Math.round((avgNominator / avgDenominator) * 10) / 10;

  const chartData: Data = Object.keys(countPerVote)
    .map((vote, i) => ({
      title: vote,
      value: countPerVote[vote],
      color: colors[i % colors.length]
    }));

  return (
    <div className={styles.container}>
      <div className={styles.avg}>
        <strong>Average: {roundedAvg || '?'}</strong>
      </div>
      <div className={styles.percentages}>
        <PieChart
          className={styles.chart}
          data={chartData}
          label={({ dataEntry: { value, title } }) => `${value} vote${value > 1 ? 's' : ''} for ${title}`}
          labelStyle={{ fontSize: '5px', fill: 'white', fontWeight: 'bold' }}
        />
      </div>
    </div>
  );
};

export default VotingResults;
