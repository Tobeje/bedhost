import { components } from '../../../../bedbase-types';
import { formatNumberWithCommas } from '../../../utils';
import { StatCard } from './stat-card-wrapper';

type BedMetadata = components['schemas']['BedMetadata'];
type Props = {
  metadata: BedMetadata;
};

export const GCContentCard = (props: Props) => {
  const { metadata } = props;

  return (
    <StatCard
      title="GC Content"
      stat={`${metadata.stats?.gc_content ? formatNumberWithCommas(metadata.stats?.gc_content) : 'N/A'}`}
      learnMoreHref="#"
    />
  );
};
