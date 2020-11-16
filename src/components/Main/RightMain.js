import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import calculateDday from '../../lib/calculateDday';

const RightMainBlock = styled.div``;

const ScheduleItem = styled.li`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  margin-bottom: 5px;
`;

const ScheduleTitle = styled.div`
  width: 40%;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const DdayListBlock = styled.ul`
  margin: 0;
  padding: 0;
`;

const DdayItem = styled.li`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 20px;
  margin: 0;
  padding: 0;
  padding: 0 10px;
  margin-bottom: 5px;
`;

const RightMain = ({ schedules, dDays }) => {
  console.log(dDays);

  if (!schedules || !dDays) {
    return <h1>Loading...</h1>;
  }

  return (
    <RightMainBlock>
      <div className="Right-Main" id="Right-Main">
        <div className="Krikri-Mall">
          <div className="Left-Mall">
            <h4>새로운 이슈</h4>
            <div className="New-Issue">
              <input type="radio" name="radio-btn" id="radio1" />
              <input type="radio" name="radio-btn" id="radio2" />
              <input type="radio" name="radio-btn" id="radio3" />
              <input type="radio" name="radio-btn" id="radio4" />
              <div className="slide first">
                <img
                  src={require('../../images/issue1.jfif')}
                  alt="새로운 이슈 첫번째 슬라이드"
                />
              </div>
              <div className="slide">
                <img
                  src={require('../../images/date1.jfif')}
                  alt="새로운 이슈 두번째 슬라이드"
                />
              </div>
              <div className="slide">
                <img
                  src={require('../../images/date2.jfif')}
                  alt="새로운 이슈 세번째 슬라이드"
                />
              </div>
              <div className="slide">
                <img
                  src={require('../../images/date3.jfif')}
                  alt="새로운 이슈 네번째 슬라이드"
                />
              </div>
            </div>
            <div className="navigation-manual">
              <label htmlFor="radio1" className="manual-btn"></label>
              <label htmlFor="radio2" className="manual-btn"></label>
              <label htmlFor="radio3" className="manual-btn"></label>
              <label htmlFor="radio4" className="manual-btn"></label>
            </div>
          </div>
          <div className="Right-Mall">
            <h4>데이트 추천장소</h4>
            <div className="Date-Recommend">
              <input type="radio" name="auto-radio-btn" id="auto-radio1" />
              <input type="radio" name="auto-radio-btn" id="auto-radio2" />
              <input type="radio" name="auto-radio-btn" id="auto-radio3" />
              <input type="radio" name="auto-radio-btn" id="auto-radio4" />
              <div className="auto-slide first2">
                <img
                  src={require('../../images/al8.png')}
                  alt="데이트 추천장소 첫번째"
                />
                <div className="auto-slide-text">자동 슬라이드1</div>
              </div>
              <div className="auto-slide">
                <img
                  src={require('../../images/al7.png')}
                  alt="데이트 추천장소 두번째"
                />
                <div className="auto-slide-text">자동 슬라이드2</div>
              </div>
              <div className="auto-slide">
                <img
                  src={require('../../images/al6.png')}
                  alt="데이트 추천장소 세번째"
                />
                <div className="auto-slide-text">자동 슬라이드3</div>
              </div>
              <div className="auto-slide">
                <img
                  src={require('../../images/al5.png')}
                  alt="데이트 추천장소 네번째"
                />
                <div className="auto-slide-text">자동 슬라이드4</div>
              </div>
              <div className="A-navigation-auto">
                <div className="A-auto-btn1"></div>
                <div className="A-auto-btn2"></div>
                <div className="A-auto-btn3"></div>
                <div className="A-auto-btn4"></div>
              </div>
            </div>
            <div className="auto-navigation-manual">
              <label htmlFor="auto-radio1" className="auto-manual-btn"></label>
              <label htmlFor="auto-radio2" className="auto-manual-btn"></label>
              <label htmlFor="auto-radio3" className="auto-manual-btn"></label>
              <label htmlFor="auto-radio4" className="auto-manual-btn"></label>
            </div>
          </div>
        </div>
        <div className="Krikri-Calendar">
          <Link to="/kkiri/calendar">
            <h3>Calendar</h3>
          </Link>
          <div className="To-Calendar">
            <div className="Left-List">
              <ul>
                {schedules.map((schedule) => (
                  <ScheduleItem key={schedule.id}>
                    <div>
                      {schedule.start.getFullYear()}년{' '}
                      {schedule.start.getMonth() + 1}월{' '}
                      {schedule.start.getDate()}일
                    </div>
                    <ScheduleTitle>{schedule.title}</ScheduleTitle>
                  </ScheduleItem>
                ))}
              </ul>
            </div>
            <div className="Right-List">
              <DdayListBlock>
                {dDays.map((dDay) => (
                  <DdayItem>
                    <div>{dDay.title}</div>
                    <div>{calculateDday(new Date(dDay.start))}</div>
                  </DdayItem>
                ))}
              </DdayListBlock>
            </div>
          </div>
        </div>
        <div className="Krikri-Album">
          <h3>Album</h3>
          <img
            src={require('../../images/plus.png')}
            className="Album-Add"
            alt="앨범 설정"
          />
          <Row className="m-0 p-0 To-Album" md={1}>
            <Col className="Show-Album" md={2} sm={1}>
              <img src={require('../../images/al2.png')} alt="첫번째 앨범" />
              <div className="Album-Date">2020-00-00</div>
            </Col>
            <Col className="Show-Album" md={2}>
              <img src={require('../../images/al3.png')} alt="첫번째 앨범" />
              <div className="Album-Date">2020-00-00</div>
            </Col>
            <Col className="Show-Album" md={2}>
              <img src={require('../../images/al4.png')} alt="첫번째 앨범" />
              <div className="Album-Date">2020-00-00</div>
            </Col>
            <Col className="Show-Album" md={2}>
              <img src={require('../../images/al5.png')} alt="첫번째 앨범" />
              <div className="Album-Date">2020-00-00</div>
            </Col>
            <Col className="Show-Album" md={2}>
              <img src={require('../../images/al6.png')} alt="첫번째 앨범" />
              <div className="Album-Date">2020-00-00</div>
            </Col>
            <Col className="Show-Album" md={2}>
              <img src={require('../../images/al7.png')} alt="첫번째 앨범" />
              <div className="Album-Date">2020-00-00</div>
            </Col>
          </Row>
        </div>
      </div>
    </RightMainBlock>
  );
};

export default RightMain;