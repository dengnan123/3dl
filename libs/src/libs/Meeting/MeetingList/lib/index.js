import MeetingListComp from '../../../../components/MeetingList';
const MeetingList = ({ data = {}, style = {} }) => {
  return <MeetingListComp style={style} data={data} />;
};

export default MeetingList;
