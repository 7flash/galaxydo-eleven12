const sdUrl = "http://localhost:7860/sdapi/v1/img2img"
const sdUrlTxt = "http://localhost:7860/sdapi/v1/txt2img"

const size = 512
const strength = 0.75
const scale = 7
const steps = 20
const samplerIndex = "Euler a"

const makeParamsImg = ({ imageIn, prompt }) => {
/*
{
  "init_images": [
   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg=="
  ],
  "resize_mode": 0,
  "denoising_strength": 0.75,
  "mask": null,
  "mask_blur": 4,
  "inpainting_fill": 0,
  "inpaint_full_res": true,
  "inpaint_full_res_padding": 0,
  "inpainting_mask_invert": 0,
  "prompt": "first",
  "styles": [
  ],
  "seed": -1,
  "subseed": -1,
  "subseed_strength": 0,
  "seed_resize_from_h": -1,
  "seed_resize_from_w": -1,
  "batch_size": 1,
  "n_iter": 1,
  "steps": 10,
  "cfg_scale": 7,
  "width": 512,
  "height": 512,
  "restore_faces": false,
  "tiling": false,
  "negative_prompt": "",
  "eta": 0,
  "s_churn": 0,
  "s_tmax": 0,
  "s_tmin": 0,
  "s_noise": 1,
  "override_settings": {},
  "sampler_index": "Euler",
  "include_init_images": false
}
*/

  return {
    // "init_images": [imageIn],
    // "denoising_strength": strength,
    // "prompt": prompt,
    // "batch_size": 1,
    // "n_iter": 1,
    // "steps": steps,
    // "cfg_scale": scale,
    // "width": size,
    // "height": size,
    // "sampler_index": samplerIndex,  

    "init_images": [imageIn],
    "resize_mode": 0,
    "denoising_strength": strength,
    "mask": null,
    "mask_blur": 4,
    "inpainting_fill": 0,
    "inpaint_full_res": false,
    "inpaint_full_res_padding": 0,
    "inpainting_mask_invert": 0,
    "prompt": prompt,
    "styles": [],
    "seed": -1,
    "subseed": -1,
    "subseed_strength": 0,
    "seed_resize_from_h": -1,
    "seed_resize_from_w": -1,
    "batch_size": 1,
    "n_iter": 1,
    "steps": steps,
    "cfg_scale": scale,
    "width": size,
    "height": size,
    "restore_faces": false,
    "tiling": false,
    "negative_prompt": "",
    "eta": 0,
    "s_churn": 0,
    "s_tmax": 0,
    "s_tmin": 0,
    "s_noise": 1,
    "override_settings": {},
    "sampler_index": samplerIndex,
    "include_init_images": false
  }
}

const makeParamsTxt = ({ prompt }) => {
  return {
    "enable_hr": false,
    "denoising_strength": strength,
    "firstphase_width": 0,
    "firstphase_height": 0,
    "prompt": prompt,
    "styles": [
      ""
    ],
    "seed": -1,
    "subseed": -1,
    "subseed_strength": 0,
    "seed_resize_from_h": -1,
    "seed_resize_from_w": -1,
    "batch_size": 1,
    "n_iter": 1,
    "steps": 10,
    "cfg_scale": 7,
    "width": 512,
    "height": 512,
    "restore_faces": false,
    "tiling": false,
    "negative_prompt": "",
    "eta": 0,
    "s_churn": 0,
    "s_tmax": 0,
    "s_tmin": 0,
    "s_noise": 1,
    "override_settings": {},
    "sampler_index": samplerIndex
  }
}

export default async function handler(req, res) {
  try {
    // const { imageIn, prompt } = req.query;
    const { prompt, imageIn } = JSON.parse(req.body);
    const params = makeParamsTxt({ prompt })
    console.log({ params })
    const resp = await fetch(sdUrlTxt, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(resp => resp.json())
    if (resp['detail']) throw resp['detail'][0].msg;
    const imageOut = resp['images'][0]
    res.status(200).json({
      imageOut: imageOut
    })
  } catch (err) {
    res.status(500).json({ error: err.toString() })
  }
}
