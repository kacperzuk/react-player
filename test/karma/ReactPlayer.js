import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import ReactPlayer from '../../src/ReactPlayer'

const { describe, it, beforeEach, afterEach } = window

const TEST_YOUTUBE_URL = 'https://www.youtube.com/watch?v=M7lc1UVf-VE'
const TEST_SOUNDCLOUD_URL = 'https://soundcloud.com/miami-nights-1984/accelerated'
const TEST_VIMEO_URL = 'https://vimeo.com/90509568'
const TEST_FILE_URL = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv'

const TEST_YOUTUBE_ERROR = 'https://www.youtube.com/watch?v=xxxxxxxxxxx'
const TEST_SOUNDCLOUD_ERROR = 'https://soundcloud.com/xxxxxxxxxxx/xxxxxxxxxxx'
const TEST_FILE_ERROR = 'http://example.com/error.ogv'

describe('ReactPlayer', () => {
  let div

  beforeEach(() => {
    div = document.createElement('div')
    document.body.appendChild(div)
  })

  afterEach(() => {
    unmountComponentAtNode(div)
    document.body.removeChild(div)
  })

  const testPlay = (url, onPlay) => {
    render(<ReactPlayer url={url} playing onPlay={onPlay} />, div)
  }

  const testPause = (url, done) => {
    const onPlay = () => {
      setTimeout(() => {
        render(<ReactPlayer url={url} playing={false} onPause={done} />, div)
      }, 500)
    }
    testPlay(url, onPlay)
  }

  const testDuration = (url, done) => {
    const onDuration = (duration) => {
      if (duration && duration > 0) done()
    }
    render(<ReactPlayer url={url} playing onDuration={onDuration} />, div)
  }

  const testError = (url, onError) => {
    render(<ReactPlayer url={url} playing onError={() => onError()} />, div)
  }

  describe('YouTube', () => {
    it('fires onPlay', (done) => testPlay(TEST_YOUTUBE_URL, done))
    it('fires onPause', (done) => testPause(TEST_YOUTUBE_URL, done))
    it('fires onDuration', (done) => testDuration(TEST_YOUTUBE_URL, done))
    it('fires onError', (done) => testError(TEST_YOUTUBE_ERROR, done))

    it('starts at a specified time', (done) => {
      const onProgress = (state) => {
        if (state.played > 0.9) done()
      }
      render(<ReactPlayer url={TEST_YOUTUBE_URL + '?start=22m10s'} playing onProgress={onProgress} />, div)
    })
  })

  describe('SoundCloud', () => {
    it('fires onPlay', (done) => testPlay(TEST_SOUNDCLOUD_URL, done))
    it('fires onPause', (done) => testPause(TEST_SOUNDCLOUD_URL, done))
    it('fires onDuration', (done) => testDuration(TEST_SOUNDCLOUD_URL, done))
    it('fires onError', (done) => testError(TEST_SOUNDCLOUD_ERROR, done))
  })

  describe('Vimeo', () => {
    it('fires onPlay a Vimeo video', (done) => testPlay(TEST_VIMEO_URL, done))
    it('fires onPause a Vimeo video', (done) => testPause(TEST_VIMEO_URL, done))
    it('fires onDuration for Vimeo video', (done) => testDuration(TEST_VIMEO_URL, done))
  })

  describe('FilePlayer', () => {
    it('fires onPlay a file', (done) => testPlay(TEST_FILE_URL, done))
    it('fires onPause a file', (done) => testPause(TEST_FILE_URL, done))
    it('fires onDuration for file', (done) => testDuration(TEST_FILE_URL, done))
    it('fires onError for file', (done) => testError(TEST_FILE_ERROR, done))
  })

  it('switches between media', function (done) {
    const renderFilePlayer = () => testPlay(TEST_FILE_URL, done)
    const renderVimeoPlayer = () => testPlay(TEST_VIMEO_URL, renderFilePlayer)
    const renderSoundCloudPlayer = () => testPlay(TEST_SOUNDCLOUD_URL, renderVimeoPlayer)
    testPlay(TEST_YOUTUBE_URL, renderSoundCloudPlayer)
  })
})
