import { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import { MapContext } from '../../app/App'
import dummyGeojson from '../../util/dummyGeojson'

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const DrawMapElements = ({
  drawnFeature,
  setDrawnFeature,
  cleared,
  setCleared
}) => {
  const [drawInstance, setDrawInstance] = useState()

  const map = useContext(MapContext)

  // creates a draw control and returns it, does not add it to the map
  const initializeDraw = () => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: 'draw_polygon'
    })

    map.on('draw.modechange', (d) => {
      if (draw.getMode() === 'simple_select') {
        draw.changeMode('draw_polygon')
      }
    })

    return draw
  }

  useEffect(() => {
    if (!map) return

    const draw = initializeDraw(map)

    map.addControl(draw)
    setDrawInstance(draw)

    // TODO: this handler doesn't work when moved to initializeDraw()
    // but it works fine here.  Not sure why.
    map.on('draw.create', (d) => {
      setDrawnFeature(d.features[0])
    })

    // check for one source in the group
    if (!map.getSource('drawn-feature')) {
      map.addSource('drawn-feature', {
        type: 'geojson',
        data: dummyGeojson
      })

      map.addLayer({
        id: 'drawn-feature-fill',
        type: 'fill',
        source: 'drawn-feature',
        paint: {
          'fill-color': 'steelblue',
          'fill-opacity': 0.6
        }
      })
    }

    return () => {
      map.getSource('drawn-feature').setData(dummyGeojson)
      map.removeControl(draw)
    }
  }, [map])

  useEffect(() => {
    if (!map) return
    map.getSource('drawn-feature').setData(drawnFeature || dummyGeojson)
  }, [map, drawnFeature])

  // when the a drawn feature exists, remove the draw control
  useEffect(() => {
    if (drawnFeature) {
      // draw will attempt to change mode on draw.create
      // but we also want to remove the draw control on draw.create
      // this timeout gives it a chance to change modes first to avoid
      // an error
      setTimeout(() => {
        map.removeControl(drawInstance)
        setDrawInstance(null)
      }, 500)
    }
  }, [drawnFeature])

  const handleClearDrawing = () => {
    const draw = initializeDraw()
    map.addControl(draw)
    setDrawInstance(draw)
    setDrawnFeature(null)
  }

  useEffect(() => {
    if (cleared) {
      handleClearDrawing()
      setCleared(false)
    }
  }, [cleared])

  return null
}

DrawMapElements.propTypes = {
  drawnFeature: PropTypes.object,
  setDrawnFeature: PropTypes.func,
  cleared: PropTypes.bool,
  setCleared: PropTypes.func
}

export default DrawMapElements
