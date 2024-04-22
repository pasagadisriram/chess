import { movesAtom, userSelectedMoveIndexAtom } from '@repo/store/chessBoard';
import { Move } from 'chess.js';
import { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  HandshakeIcon,
  FlagIcon,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
const MovesTable = () => {
  const [userSelectedMoveIndex, setUserSelectedMoveIndex] = useRecoilState(
    userSelectedMoveIndexAtom,
  );
  const moves = useRecoilValue(movesAtom);
  const movesTableRef = useRef<HTMLInputElement>(null);
  const movesArray = moves.reduce((result, _, index: number, array: Move[]) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, [] as Move[][]);

  useEffect(() => {
    if (movesTableRef && movesTableRef.current) {
      movesTableRef.current.scrollTo({
        top: movesTableRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [moves]);

  return (
    <div className="text-[#C3C3C0] relative w-full ">
      <div
        className="text-sm max-h-[45vh] overflow-y-scroll"
        ref={movesTableRef}
      >
        {movesArray.map((movePairs, index) => {
          return (
            <div
              key={index}
              className={`w-full py-px px-4 font-bold items-stretch ${index % 2 !== 0 ? 'bg-[#2B2927]' : ''}`}
            >
              <div className="grid grid-cols-6 gap-16 w-4/5">
                <span className="text-[#C3C3C0] px-2 py-1.5">{`${index + 1}.`}</span>

                {movePairs.map((move, movePairIndex) => {
                  const isLastIndex =
                    movePairIndex === movePairs.length - 1 &&
                    movesArray.length - 1 === index;
                  const isHighlighted =
                    userSelectedMoveIndex !== null
                      ? userSelectedMoveIndex === index * 2 + movePairIndex
                      : isLastIndex;
                  const { san } = move;

                  return (
                    <div
                      key={movePairIndex}
                      className={`col-span-2 cursor-pointer flex items-center w-full pl-1 ${isHighlighted ? 'bg-[#484644] rounded border-b-[#5A5858] border-b-[3px]' : ''}`}
                      onClick={() => {
                        setUserSelectedMoveIndex(index * 2 + movePairIndex);
                      }}
                    >
                      <span className="text-[#C3C3C0]">{san}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full p-2 bg-[#20211D] flex items-center justify-between">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 hover:bg-[#32302E] rounded px-2.5 py-1">
            {<HandshakeIcon size={16} />}
            Draw
          </button>
          <button className="flex items-center gap-2 hover:bg-[#32302E] rounded px-2.5 py-1">
            {<FlagIcon size={16} />}
            Resign
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => {
              setUserSelectedMoveIndex(0)
            }}
            disabled={userSelectedMoveIndex === 0}
            className="hover:text-white"
          >
            <ChevronFirst />
          </button>

          <button
            onClick={() => {
              setUserSelectedMoveIndex(prev=> prev!==null ? prev-1 : moves.length-2);
            }}
            disabled={userSelectedMoveIndex === 0}
            className="hover:text-white"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => {
              setUserSelectedMoveIndex((prev) =>
                prev !== null &&
                prev !== moves.length - 1 &&
                !(prev === moves.length - 2)
                  ? prev + 1
                  : null,
              );
            }}
            disabled={
              userSelectedMoveIndex === null ||
              userSelectedMoveIndex === moves.length - 1
            }
            className="hover:text-white"
          >
            <ChevronRight />
          </button>
          <button
            onClick={() => {
              setUserSelectedMoveIndex(null);
            }}
            disabled={
              userSelectedMoveIndex === null ||
              userSelectedMoveIndex === moves.length - 1
            }
            className="hover:text-white"
          >
            <ChevronLast />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovesTable;
