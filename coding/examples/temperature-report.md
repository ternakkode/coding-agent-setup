# Example: Build a Temperature Report

Expose this collection workflow in a script function or file. Reuse a similar operation's entry-point, data-access, client, and mapping patterns.

Assume valid building and range inputs. Report averages for enabled sensors, keeping the first enabled record per ID. Readings are finite Celsius values; no observations means unavailable. Read or vendor failures stop before saving.

## Pseudocode

```text
// Script entry point; reuse the project's existing invocation convention.
function buildTemperatureReport(buildingId, range):
    candidates = retrieveBuildingSensors(buildingId)
    sensors = selectEnabledSensors(candidates)

    readingsBySensor = fetchSensorReadings(sensors, range)

    report = summarizeSensors(sensors, readingsBySensor)

    saveTemperatureReport(buildingId, range, report)

    return report
```

`fetchSensorReadings` returns a complete ID-to-readings map, including empty lists for explicit no-readings responses. `summarizeSensors` produces one row per selected sensor without I/O.

## Supporting Responsibilities

```text
function selectEnabledSensors(candidates):
    sensorsById = empty map

    for each sensor in candidates:
        if sensor.enabled and sensor.id is not in sensorsById:
            sensorsById[sensor.id] = sensor

    return values of sensorsById

function summarizeSensors(sensors, readingsBySensor):
    report = empty list

    for each sensor in sensors:
        readings = readingsBySensor[sensor.id]
        average = calculateAverage(readings)

        append to report:
            sensorId = sensor.id
            averageTemperatureCelsius = average

    return report
```

`sensorsById` and `report` accumulate local state; `readings` and `average` are per-iteration values. The formula lives in the [small calculation](small-calculation.md).

## Example Structure

This project already has client, DB, and repository modules. Adapt these illustrative locations to existing conventions; small helpers can remain in the script file.

```text
src/
├── client/
│   └── sensor-vendor/
│       ├── readings          # HTTP, authentication, pagination, response validation
│       └── mapping           # Vendor readings → sensor IDs and Celsius observations
├── db/
│   ├── sensors               # Building-scoped queries; returns database rows
│   └── temperature-reports   # Report writes and transaction mechanics
├── repository/
│   ├── sensors               # Retrieve domain sensors through db/sensors
│   ├── temperature-reports   # Save domain reports through db/temperature-reports
│   └── mapping               # Database rows ↔ domain data
└── scripts/
    └── temperature-report/
        ├── build-report      # Script entry point: main flow shown above
        ├── prepare-sensors   # Eligibility and deduplication
        ├── fetch-readings    # Request selection, batching, and rate limits
        ├── summarize-sensors # Per-sensor inputs and report row assembly
        └── calculate-average # Formula and empty-input result
```

Repositories here map storage into domain data. If the existing DB interface already does that, reuse it rather than adding a repository layer.

Fetch coordination chooses unique IDs and batches within vendor limits; the client owns HTTP, authentication, pagination, and response validation. With no sensors, coordination returns an empty map without a network call. Malformed responses fail rather than becoming empty observations.

Persistence uses the existing concurrency and error contract. Sharing data within a run does not imply persistent caching; that requires an agreed requirement.

## Mapping at the Boundaries

Assume database fields `sensor_id` and `enabled_flag`, and validated vendor fields `sensor_key` and `observations_celsius`. Map them near their source owner:

```text
// repository/sensors
function retrieveBuildingSensors(buildingId):
    rows = db.sensors.findByBuilding(buildingId)

    return map each row using mapSensorRow

// repository/mapping
function mapSensorRow(row):
    return sensor:
        id = row.sensor_id
        enabled = row.enabled_flag

// client/sensor-vendor/mapping
function mapVendorReadings(validatedResponse):
    return sensorReadings:
        sensorId = validatedResponse.sensor_key
        readings = validatedResponse.observations_celsius

// repository/temperature-reports
function saveTemperatureReport(buildingId, range, report):
    storedReport = mapReportForStorage(buildingId, range, report)

    db.temperatureReports.save(storedReport)
```

`mapReportForStorage` follows the existing schema for building, range, and report rows, preserving available/unavailable averages. Preparation owns eligibility and deduplication; coordination groups normalized readings by ID; summarization assembles calculation results. The script needs neither database column names nor vendor fields.

## Cohesion and Coupling

Compare what the caller must understand:

```text
// Leaks the vendor's response structure into the caller.
calculateAverage(vendorResponse.payload.sensor.observations_celsius)

// The client has already mapped the response into the agreed domain data.
calculateAverage(readings)
```

A vendor field rename changes client mapping; a formula adjustment changes `calculateAverage`. Neither should spread into unrelated script, HTTP, or database mechanics. Splitting helpers that share mutable state can increase coupling rather than improve it.

## Trace and Review

Enabled sensors `A, A, B` and disabled `C` yield `A, B`. Readings `A → [18, 22]` and `B → []` yield an average of `20` Celsius for `A` and an unavailable result for `B`. Save once, then return the report. With no enabled sensors, save and return an empty report.

Verify that failures stop before saving and each query, mapping, request policy, and formula has a directly identifiable owner.

Return to [code quality](../code-quality.md#examples).
