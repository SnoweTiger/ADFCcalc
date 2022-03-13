
function ready(){
  N1 = input_N1.value;
  F1 = input_F1.value;
  P1 = input_P1.value;

  // alert("Hello", F1);

  // Draw(F1,P1,N1);
  // updateFields();
};

input_P1 = document.querySelector('input[aria-label="power"]');
input_N1 = document.querySelector('input[aria-label="speed"]');
input_F1 = document.querySelector('input[aria-label="fr"]');
input_N2 = document.querySelector('input[aria-label="out_speed"]');
input_pole = document.querySelector('input[aria-label="poles"]');

input_drivetype = document.querySelector('select[aria-label="drive-type"]');
// drive-type

output_block = document.querySelector('div[id="output"]');

input_F2 = document.querySelector('input[aria-label="target_fr"]');
input_P2 = document.querySelector('input[aria-label="power_out"]');

input_ratio = document.querySelector('input[aria-label="ratio"]');

output_block.style.visibility = "hidden";


canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

function Scaler_X(X, scale){
  result = X * scale + 40;
  return result;
}

function Scaler_Y(Y, scale){
  result = canvas.height - Y * scale - 40;
  return result;
}

function Scale(Axe_L,X,X2){
  if (X2 >= X){
    return Axe_L / X2;
  }
  else{
    return Axe_L / X;
  }
}


function Draw(F,P,N,N2,POL,RATIO,DRIVETYPE){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  AxeX_L = canvas.width - 40 - 20;
  AxeY_L = canvas.height- 40 - 20;
  AxeX_D = 10;
  AxeY_D = 10;

  scale_F_step = AxeX_L / AxeX_D ;
  scale_P_step = AxeY_L / AxeY_D ;
  scale_N_step = AxeY_L / AxeY_D ;

  scale_F = F / AxeX_D ;
  scale_P = P / AxeY_D ;
  scale_N = N / AxeY_D ;



  S = 0;

  //Считаем характеристики в точке
  N2motor = N2 * RATIO
  F2 = ((N2motor * POL) / (120 * (1-S)));
  // N2 = (1-S)*(60 * F2)/(POL/2);
  P2 = ((P*N2motor*N2motor*N2motor)/(N*N*N));
  // alert('F2='+F2+' '+P2);

  output_block.style.visibility = "visible";

  input_F2.setAttribute('value', F2.toFixed(2));
  input_P2.setAttribute('value', P2.toFixed(2));

  // считаем маштабы
  // scaleF = AxeX_L / F;
  // scaleN = AxeY_L / N2;
  // scaleP = AxeY_L / P2;

  if (F2>=50){
    // Fend = Math.ceil(F2)
    Fend = Math.ceil(F2 / 10) * 10;
    Fx = Math.ceil(F2)
  }else{
    Fend = 50;
    Fx = 50;
  }
  scaleF = AxeX_L / Fend;

  Nend = ((1-S)*(60 * Fend)/(POL/2)) / RATIO;
  Nend = Math.ceil(Nend)
  Nendmotor = Nend * RATIO
  Pend = ((P*Nendmotor*Nendmotor*Nendmotor)/(N*N*N));
  Pend = Math.ceil(Pend)

  scaleN = AxeY_L / Nend;
  scaleP = AxeY_L / Pend;

  scale_F = Fend / AxeX_D ;
  scale_P = Pend / AxeY_D ;
  scale_N = Nend / AxeY_D ;

  // scaleF = AxeX_L / Fend;
  // scaleN = AxeY_L / Nend;
  // scaleP = AxeY_L / Pend;

  // alert('Fend='+Fend+'Pend='+Pend+'Nend='+Nend);
  // alert('scale='+scaleF+'/'+scaleN+'/'+scaleP);



  //Рисуем графики мощности и оборотов от частоты
  let graf_N = [];
  let graf_P = [];
  let graf_F = [];

  // RATIO = 1;

  for(let i = 0; i<=(Fx-10); i++){
    Fi = i + 10;
    Ni = (1-S) * (60 * Fi) / (POL / 2);
    Pi = (P1 * Ni*Ni*Ni)/(N*N*N);
    graf_F[i] = Fi;
    graf_N[i] = Ni / RATIO;
    graf_P[i] = Pi;
  }



  ctx.beginPath();
  i = 0;
  x = Scaler_X(graf_F[i], scaleF);
  y = Scaler_Y(graf_N[i], scaleN);
  ctx.moveTo(x,y);
  //alert('x='+x+'y='+y);


  for(let i = 0; i<=(Fend-10); i++){
    x = Scaler_X(graf_F[i], scaleF);
    y = Scaler_Y(graf_N[i], scaleN);
    ctx.lineTo(x,y);
  }
  ctx.strokeStyle = 'green';
  ctx.stroke();

  ctx.beginPath();
  i = 0;
  x = Scaler_X(graf_F[i], scaleF);
  y = Scaler_Y(graf_P[i], scaleP);
  ctx.moveTo(x,y);

  for(let i = 1; i<=(Fend-10); i++){
    x = Scaler_X(graf_F[i], scaleF);
    y = Scaler_Y(graf_P[i], scaleP);
    ctx.lineTo(x,y);
  }
  ctx.strokeStyle = 'red';
  ctx.stroke();



  // Рисуем точку N
  ctx.beginPath();
  ctx.strokeStyle = 'green'
  ctx.fillStyle = 'green'
  x = Scaler_X(F2, scaleF);
  y = Scaler_Y(N2, scaleN);
  ctx.arc(x,y,5,0,Math.PI*2,true)
  ctx.fill();

  ctx.setLineDash([10, 5]);
  ctx.moveTo(x,AxeY_L + 20 + 10);
  ctx.lineTo(x,y);
  ctx.lineTo(20,y);
  ctx.stroke();

  //Рисуем точку P
  ctx.beginPath();
  ctx.strokeStyle = 'red'
  ctx.fillStyle = 'red'
  x = Scaler_X(F2, scaleF);
  y = Scaler_Y(P2, scaleP);
  ctx.arc(x,y,5,0,Math.PI*2,true)
  ctx.fill();

  ctx.moveTo(x,y);
  ctx.lineTo(20,y);
  ctx.stroke();

  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1.0;
  ctx.setLineDash([])
  ctx.beginPath();
  ctx.moveTo(40 , 20);
  ctx.lineTo(40, AxeY_L+20);
  ctx.lineTo(AxeX_L+40, AxeY_L+20);
  ctx.stroke();

  //Рисуем шкалу N
  ctx.font = "normal normal 12px Helvetica";
  ctx.fillStyle = "green";
  ctx.textAlign = 'right';
  for(let i = 0; i <= AxeY_D ; i++) {
        ctx.fillText(Nend - i*scale_N + "", 30, i * scale_N_step + 20);
        ctx.beginPath();
        ctx.moveTo(33, i  * scale_N_step + 20);
        ctx.lineTo(40, i  * scale_N_step + 20);
        ctx.stroke();
  }

  //Рисуем шкалу P
  ctx.fillStyle = "red";
  ctx.strokeStyle = 'black';
  for(let i = 0; i <= AxeY_D ; i++) {
        ctx.fillText((Pend - i*scale_P).toFixed(1) + "", 30, i * scale_P_step + 20 +10);
  }

  //Рисуем шкалу f
  ctx.fillStyle = "Black";
  ctx.strokeStyle = 'black';
  for(let i = 0; i <= AxeX_D; i++) {
        ctx.fillText(i * scale_F + "", i  * scale_F_step + 40, AxeY_L +20 +30);
        ctx.beginPath();
        ctx.moveTo(i  * scale_F_step + 40, AxeY_L + 20);
        ctx.lineTo(i  * scale_F_step + 40, AxeY_L + 20 + 10);
        ctx.stroke();
  }



}


button = document.getElementById('BtCalc');
button.onclick = function() {
  P1 = input_P1.value;
  N1 = input_N1.value;
  F1 = input_F1.value;
  N2 = input_N2.value;
  POL = input_pole.value;
  RATIO = input_ratio.value;

  DRIVETYPE = input_drivetype.value;
  // alert(DRIVETYPE);

  // alert(P1+' '+N1+' '+F1);
  Draw(F1,P1,N1,N2,POL,RATIO,DRIVETYPE);
  };

input_drivetype.onchange = function(){
  DRIVETYPE = input_drivetype.value;
  if (DRIVETYPE == 1){
    // alert('raz');
    input_ratio.value = 1;
    input_ratio.disabled = true;
  }
  else{
    // alert('dwa');
    input_ratio.disabled = false;
    }
  }



document.addEventListener("DOMContentLoaded", ready());
