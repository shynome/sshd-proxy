import { getSSHHosts } from "../getSSHHosts";

describe('utils', () => {
  it('getSSHHosts', async () => {
    let hosts: string[]
    hosts = await getSSHHosts()
    expect(hosts.length).toBeGreaterThan(0)
    hosts = await getSSHHosts('/work/sss')
    expect(hosts).toHaveLength(0)
  })
})
