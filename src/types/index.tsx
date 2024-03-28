export type Map = {
  amount: 1;
  frequency: string;
  name: string;
  number: number;
  type: string;
  img: string;
};

export type MVPMonster = {
  monster_id: number;
  monster_info: string;
  gif: string;
  skills: {
    mode: string[];
  };
  maps: Map[];
  lastKill: string;
};
