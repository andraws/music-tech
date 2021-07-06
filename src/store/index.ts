import Vue from 'vue'
import Vuex from 'vuex'
import * as Tone from 'tone'

Vue.use(Vuex)

const DRUM_CLASSES = [
  'Kick',
  'Snare',
  'Hi-hat closed',
  'Hi-hat open',
  'Tom low',
  'Tom mid',
  'Tom high',
  'Clap',
  'Rim'
];

const sampleBaseUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/969699';

export interface IPlayQueItem {
  id: number;
  timeStep: number;
  kit: Tone.Players;
  velocity: string;
}

const createKit = function() {
  const reverb = new Tone.Convolver(
    `${sampleBaseUrl}/small-drum-room.wav`
  ).toDestination();

  const snarePanner = new Tone.Panner().connect(reverb);
  new Tone.LFO(0.13, -0.25, 0.25).connect(snarePanner.pan).start();

  const drumKit = [
    new Tone.Players({
      high: `${sampleBaseUrl}/808-kick-vh.mp3`,
      med: `${sampleBaseUrl}/808-kick-vm.mp3`,
      low: `${sampleBaseUrl}/808-kick-vl.mp3`
    }).toDestination(),
    new Tone.Players({
      high: `${sampleBaseUrl}/flares-snare-vh.mp3`,
      med: `${sampleBaseUrl}/flares-snare-vm.mp3`,
      low: `${sampleBaseUrl}/flares-snare-vl.mp3`
    }).connect(snarePanner),
    new Tone.Players({
      high: `${sampleBaseUrl}/808-hihat-vh.mp3`,
      med: `${sampleBaseUrl}/808-hihat-vm.mp3`,
      low: `${sampleBaseUrl}/808-hihat-vl.mp3`
    }).connect(new Tone.Panner(-0.5).connect(reverb)),
    new Tone.Players({
      high: `${sampleBaseUrl}/808-hihat-open-vh.mp3`,
      med: `${sampleBaseUrl}/808-hihat-open-vm.mp3`,
      low: `${sampleBaseUrl}/808-hihat-open-vl.mp3`
    }).connect(new Tone.Panner(-0.5).connect(reverb)),
    new Tone.Players({
      high: `${sampleBaseUrl}/slamdam-tom-low-vh.mp3`,
      med: `${sampleBaseUrl}/slamdam-tom-low-vm.mp3`,
      low: `${sampleBaseUrl}/slamdam-tom-low-vl.mp3`
    }).connect(new Tone.Panner(-0.4).connect(reverb)),
    new Tone.Players({
      high: `${sampleBaseUrl}/slamdam-tom-mid-vh.mp3`,
      med: `${sampleBaseUrl}/slamdam-tom-mid-vm.mp3`,
      low: `${sampleBaseUrl}/slamdam-tom-mid-vl.mp3`
    }).connect(reverb),
    new Tone.Players({
      high: `${sampleBaseUrl}/slamdam-tom-high-vh.mp3`,
      med: `${sampleBaseUrl}/slamdam-tom-high-vm.mp3`,
      low: `${sampleBaseUrl}/slamdam-tom-high-vl.mp3`
    }).connect(new Tone.Panner(0.4).connect(reverb)),
    new Tone.Players({
      high: `${sampleBaseUrl}/909-clap-vh.mp3`,
      med: `${sampleBaseUrl}/909-clap-vm.mp3`,
      low: `${sampleBaseUrl}/909-clap-vl.mp3`
    }).connect(new Tone.Panner(0.5).connect(reverb)),
    new Tone.Players({
      high: `${sampleBaseUrl}/909-rim-vh.wav`,
      med: `${sampleBaseUrl}/909-rim-vm.wav`,
      low: `${sampleBaseUrl}/909-rim-vl.wav`
    }).connect(new Tone.Panner(0.5).connect(reverb))
  ];
  Tone.loaded()
    .then(() => console.log("Loaded Drum Samples"))
    .catch((err) => console.error(err));
  return drumKit;
};

const groupBy = (array: IPlayQueItem[]) => {
  return array.reduce((result: Map<number, IPlayQueItem[]>, currentValue: IPlayQueItem) => {
    let elementList: IPlayQueItem[] = []
    const getter = result.get(currentValue.timeStep);
    if(typeof getter !== 'undefined'){
      elementList = getter;
    }
    elementList.push(currentValue);
    result.set(currentValue.timeStep, elementList);
    return result;
  }, new Map<number, IPlayQueItem[]>());
};

export default new Vuex.Store({
  state: {
  Tone: Tone,
  timeSteps: 15,
  drumKit: [] as Tone.Players[],
  DRUM_CLASSES: DRUM_CLASSES,
  playQue: [] as IPlayQueItem[],
  playSequence: [] as Tone.Player[],
  sequenceStep: 1,
  },
  mutations: {
    async init(state){
      state.drumKit = createKit();
    },
    incrementSequenceStep(state){
      state.sequenceStep += 1
    },
    resetSequenceStep(state){
      state.sequenceStep = 1
    },
    incrementTimeStep(state){
      if (state.timeSteps < 20){
        state.timeSteps += 1
      }
    },
    decrementTimeStep(state){
      if (state.timeSteps !== 1){
        state.timeSteps -= 1
      }
    },
    addPlayQueItem(state, item: IPlayQueItem){
      state.playQue.push(item);
    },
    removePlayQueItem(state, item: IPlayQueItem){
      const playQue = state.playQue;
      state.playQue = playQue.filter((playQueItems) => {
        return playQueItems.id !== item.id}
      );
    },
    addToPlaySequence(state, player: Tone.Player){
      state.playSequence.push(player);
    }
  },
  actions: {
    async init({ commit }){
      Tone.start()
        .then(() => console.log("Tone is Loaded"))
        .catch(() => console.log("We got an error"));
      commit('init');
      
    },
    async play({state, commit}, payload){
      const sequence: Map<number, IPlayQueItem[]> = payload.sequence;
      const time = payload.time
      const currentStep = sequence.get(state.sequenceStep);
      if(state.sequenceStep < sequence.size + 1){
        commit('incrementSequenceStep')
      }else commit('resetSequenceStep')
      if(typeof currentStep !== 'undefined'){
        currentStep.forEach((player: IPlayQueItem) => {
        player.kit.player(player.velocity).start(time);
      })
    }
    },
    async playSequence({state, dispatch}, tempo: number){
      Tone.Transport.bpm.value = tempo;
      state.playQue.sort((a,b) => {
        return a.timeStep - b.timeStep;
      })
      const groupedQue = groupBy(state.playQue);
      Tone.Transport.scheduleRepeat(async (time)=>{
        const payload = {sequence: groupedQue, time: time}
        await dispatch('play', payload)
        // playSequence(groupedQue, time);
      }, '8n')
      Tone.Transport.start();
    },
    stopSequence({commit}){
      Tone.Transport.stop();
      Tone.Transport.cancel();
      commit('resetSequenceStep')
    }
  },
  getters:{
    getID(state){
      if(state.playQue.length === 0)
      {
        return 0
      }else{
        let id = -1
        const playQueIds = state.playQue.map((playQueItem) => playQueItem.id).sort()
        playQueIds.forEach((playQueID) => {
          if(playQueID > id + 1){
            return id + 1
          }else{
            id = playQueID
          }
        })
        return id + 1;
    }
  }
  },
  modules: {
  }
})