import createRandomCode from "../../lib/createRandomCode";
import Member from "../../models/member";
import Room from "../../models/room";
import Calendar from "../../models/calendar";
import Album from "../../models/album";

export const checkCode = async (ctx) => {
  const { code } = ctx.params;
  // console.log(code);

  try {
    const result = await Member.findUserCode(code);
    ctx.body = result.serialize();
  } catch (e) {
    // 상대방을 코드로 찾을 수 없음
    console.log(e);
    ctx.status = 401;
  }
};

//CoupleSet === chattingRoom, calendar, album
export const createCoupleSet = async (ctx) => {
  // 코드 등록을 시도한 사용자의 id와 member (커플1)firstMember
  const firstMemberId = ctx.state.member._id;
  // 코드 등록을 당한 사용자의 id와 member (커플2)secondMember
  const secondMemberId = ctx.request.body._id;
  if (!firstMemberId || !secondMemberId) {
    ctx.status = 401;
    return;
  }
  try {
    const firstMember = await Member.findById(firstMemberId);
    const secondMember = await Member.findById(secondMemberId);

    // 제공해야 할 것들
    const coupleShareCode = await createRandomCode();

    // 개인 고유 번호들은 이제 지워주기
    firstMember.deleteUserCode();
    secondMember.deleteUserCode();
    // 대신 커플 공유 코드 넣어주기
    firstMember.insertCoupleShareCode(coupleShareCode);
    secondMember.insertCoupleShareCode(coupleShareCode);
    // 서로 커플 id 등록해주기
    firstMember.insertCoupleId(secondMemberId);
    secondMember.insertCoupleId(firstMemberId);

    // room calendar album 만들어 준 다음 커플코드를 고유 아이디, owner 추가해주기
    const room = await new Room({
      coupleShareCode,
      owner: [firstMemberId, secondMemberId],
    });
    const calendar = await new Calendar({
      coupleShareCode,
      owner: [firstMemberId, secondMemberId],
    });
    const album = await new Album({
      coupleShareCode,
      owner: [firstMemberId, secondMemberId],
    });

    // 변경사항 저장
    await firstMember.save();
    await secondMember.save();
    await room.save();
    await calendar.save();
    await album.save();

    ctx.body = { message: "success" };
  } catch (e) {
    ctx.throw(500, { message: e });
  }
};