import React, { useCallback, useState } from 'react';
import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import './App.scss'
import 'antd/dist/antd.css'

function createLog(log: string) {
  const date = new Date()
  return(`${log} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
}

function App() {
  const [logs, setLogs] = useState<string[]>([])
  const addLog = useCallback((log: string) => {
    const nextLogs = [log, ...logs.slice(0, 49)]
    setLogs(nextLogs)
  }, [logs])

  const [players, setPlayers] = useState([
    {
      name: '侯三',
      score: 15000,
    },
    {
      name: '侯六',
      score: 15000,
    },
    {
      name: '侯七',
      score: 15000,
    },
    {
      name: '侯十',
      score: 15000,
    },
    {
      name: '侯某',
      score: 15000,
    },
  ])

  const addScore = useCallback((_sender: string, _receiver: string, _transaction: number) => {
    const nextPlayers = players.map((player) => {
      if (player.name === _sender) {
        return {
          ...player,
          score: player.score - _transaction,
        }
      }

      if (player.name === _receiver) {
        return {
          ...player,
          score: player.score + _transaction,
        }
      }

      return player
    })

    setPlayers(nextPlayers)
  }, [players])

  const [sender, setSender] = useState<string | undefined>()
  const [receiver, setReceiver] = useState<string | undefined>()
  const [transaction, setTransaction] = useState<number>(0)

  const names = [{
    label: '银行',
    value: '银行',
  }].concat(
      players.map(({ name }) => ({
      label: name,
      value: name,
    }))
  )

  const [key, setKey] = useState(0)
  const reRender = useCallback(() => {
    setTimeout(() => {
      setKey(key + 1)
      setSender(undefined)
      setReceiver(undefined)
      setTransaction(0)
    }, 50)
  }, [key])
  
  return (
    <div className="App">
      <Space direction="vertical" size="large">
        <Space size="small" direction="vertical">
          <Input.Group>
            <Select
              size="large"
              placeholder="付款"
              key={key + '付款'}
              options={names}
              onChange={(_sender) => {
                setSender(_sender)
              }}
            />
            <ArrowRightOutlined />
            <Select
              key={key + '收款'}
              size="large"
              placeholder="收款"
              options={names}
              onChange={(_receiver) => {
                setReceiver(_receiver)
              }}
            />
          </Input.Group>
          <InputNumber
            key={key}
            controls={false}
            value={transaction || undefined}
            size="large"
            addonAfter={(
              <span
                className="add-transaction"
                onClick={() => {
                  if (sender && receiver && transaction) {
                    addScore(sender, receiver, transaction)
                    addLog(createLog(`${sender} 支付 ${receiver} ${transaction}元`))
                    reRender()
                  }
                }}
              >
                ￥
              </span>
            )}
            onChange={(_transaction) => {
              setTransaction(parseInt(_transaction as unknown as string) || 0)
            }}
          />
        </Space>
        <div>
          {
            players.map((player) => (
              <Form.Item
                required
                key={player.name}
                label={player.name}
              >
                <InputNumber
                  size="large"
                  controls={false}
                  value={player.score}
                  onPressEnter={(e) => {
                    setPlayers(
                      players.map((_player) => {
                        if (_player.name === player.name) {
                          return {
                            ..._player,
                            score: parseInt((e.target as any).value),
                          }
                        }

                        return _player
                      })
                    )
                  }}
                />
              </Form.Item>
            ))
          }
        </div>

        <ul className="logs">
          {
            logs.map((log) => (
              <li key={log}>{log}</li>
            ))
          }
        </ul>

        <Button
          onClick={() => {
            localStorage.clear()
            window.location.reload()
          }}
        >
          重置
        </Button>
      </Space>
    </div>
  );
}

export default App;
